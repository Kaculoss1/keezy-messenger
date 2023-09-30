import prismaClient from "../libs/prismadb";

const getMessages = async (convoId: string) => {
  try {
    const messages = await prismaClient.message.findMany({
      where: { conversationId: convoId },
      include: { sender: true, seen: true },
      orderBy: { createdAt: "asc" },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
