"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConvoType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

type ConversationListProps = {
  initialItems: FullConvoType[];
  users: User[];
};

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(
    () => session?.data?.user?.email,
    [session?.data?.user?.email]
  );

  useEffect(() => {
    if (!pusherKey) return;

    const newHandler = (convo: FullConvoType) => {
      setItems((current) => {
        if (find(current, { id: convo.id })) return current;

        return [convo, ...current];
      });
    };

    const updateHandler = (convo: FullConvoType) => {
      setItems((current) =>
        current.map((currentConvo) => {
          if (currentConvo.id === convo.id)
            return { ...currentConvo, messages: convo.messages };

          return currentConvo;
        })
      );
    };

    const removeHandler = (convo: FullConvoType) => {
      setItems((current) => [...current.filter((con) => con.id !== convo.id)]);

      if (conversationId === convo.id) {
        router.push("/conversations");
      }
    };

    pusherClient.subscribe(pusherKey);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0",
          isOpen ? "hidden" : "left-0 block w-full"
        )}
      >
        <div className="px-5">
          <div className="mb-4 flex justify-between pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition hover:opacity-75"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
