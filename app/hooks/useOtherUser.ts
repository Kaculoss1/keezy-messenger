import { User } from "@prisma/client";
import { FullConvoType } from "../types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export default function useOtherUser(convo: FullConvoType | { users: User[] }) {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = convo.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser[0];
  }, [session?.data?.user?.email, convo.users]);

  return otherUser;
}
