import getCurrentUser from "@/app/actions/getCurrentUser";
import prismaClient from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email)
      return new NextResponse("Unauthorized", { status: 401 });

    if (isGroup && (!members || members.length < 2 || !name))
      return new NextResponse("Invalid data", { status: 400 });

    if (isGroup) {
      const newConvo = await prismaClient.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: currentUser.id },
            ],
          },
        },
        include: { users: true },
      });

      newConvo.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConvo);
        }
      });

      return NextResponse.json(newConvo);
    }

    const existingConvos = await prismaClient.conversation.findMany({
      where: {
        OR: [
          { userIds: { equals: [currentUser.id, userId] } },
          { userIds: { equals: [userId, currentUser.id] } },
        ],
      },
    });

    const convo = existingConvos[0];

    if (convo) return NextResponse.json(convo);

    const newConvo = await prismaClient.conversation.create({
      data: { users: { connect: [{ id: currentUser.id }, { id: userId }] } },
      include: { users: true },
    });

    newConvo.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConvo);
      }
    });

    return NextResponse.json(newConvo);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
