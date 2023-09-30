import prismaClient from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) return [];

  try {
    const convos = await prismaClient.conversation.findMany({
      orderBy: { lastMessageAt: "desc" },
      where: { userIds: { has: currentUser.id } },
      include: {
        users: true,
        messages: { include: { sender: true, seen: true } },
      },
    });

    return convos;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
