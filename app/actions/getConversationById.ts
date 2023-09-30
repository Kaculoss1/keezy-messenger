import prismaClient from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversationById = async (convoId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) return null;

    const convo = await prismaClient.conversation.findUnique({
      where: { id: convoId },
      include: { users: true },
    });

    return convo;
  } catch (error: any) {
    return null;
  }
};

export default getConversationById;
