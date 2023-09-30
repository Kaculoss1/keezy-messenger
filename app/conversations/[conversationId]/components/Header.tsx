"use client";

import { Avatar, AvatarGroup } from "@/app/components";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import useActiveList from "@/app/hooks/useActiveList";

type HeaderProps = {
  convo: Conversation & {
    users: User[];
  };
};

const Header: React.FC<HeaderProps> = ({ convo }) => {
  const otherUser = useOtherUser(convo);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const statusText = useMemo(() => {
    if (convo.isGroup) return `${convo.users.length} members`;

    return isActive ? "Active" : "Offline";
  }, [convo, isActive]);

  return (
    <>
      <ProfileDrawer
        data={convo}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="flex w-full items-center justify-between border-b-[1px] bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/conversations"
            className="block cursor-pointer text-sky-500 transition hover:text-sky-600 lg:hidden"
          >
            <HiChevronLeft size={32} />
          </Link>
          {convo.isGroup ? (
            <AvatarGroup users={convo.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>{convo.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>

        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="cursor-pointer text-sky-500 transition hover:text-sky-600"
        />
      </div>
    </>
  );
};

export default Header;
