import getCurrentUser from "@/app/actions/getCurrentUser";
import prismaClient from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

type Iparams = {
  conversationId?: string;
};

export async function POST(request: Request, { params }: { params: Iparams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const convo = await prismaClient.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true, messages: { include: { seen: true } } },
    });

    if (!convo) return new NextResponse("Invalid ID", { status: 400 });

    const lastMessage = convo.messages[convo.messages.length - 1];

    if (!lastMessage) return NextResponse.json(convo);

    const updateMessage = await prismaClient.message.update({
      where: { id: lastMessage.id },
      include: { sender: true, seen: true },
      data: { seen: { connect: { id: currentUser.id } } },
    });

    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updateMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1)
      return NextResponse.json(convo);

    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updateMessage
    );

    return NextResponse.json(updateMessage);
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGES_SEEN");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
