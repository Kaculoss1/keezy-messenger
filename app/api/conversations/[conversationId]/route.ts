import getCurrentUser from "@/app/actions/getCurrentUser";
import prismaClient from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

type IParams = {
  conversationId?: string;
};

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse("Unauthorized", { status: 401 });

    const existingConvo = await prismaClient.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true },
    });

    if (!existingConvo) return new NextResponse("Invalid ID", { status: 400 });

    const deletedConvo = await prismaClient.conversation.deleteMany({
      where: { id: conversationId, userIds: { hasSome: [currentUser.id] } },
    });

    existingConvo.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:remove", existingConvo);
      }
    });

    return NextResponse.json(deletedConvo);
  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
