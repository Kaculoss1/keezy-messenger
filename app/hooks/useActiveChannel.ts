import { useEffect, useState } from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
  const { add, set, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-keezy-messenger");
      setActiveChannel(channel);
    }

    const setMember = (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      set(initialMembers);
    };

    const addMember = (member: Record<string, any>) => {
      add(member.id);
    };

    const removeMember = (member: Record<string, any>) => {
      remove(member.id);
    };

    channel.bind("pusher:subscription_succeeded", setMember);
    channel.bind("pusher:member_added", addMember);
    channel.bind("pusher:member_removed", removeMember);

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-keezy-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
