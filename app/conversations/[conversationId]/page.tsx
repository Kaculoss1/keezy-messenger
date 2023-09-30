import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import { EmptyState } from "@/app/components";
import { Body, Form, Header } from "./components";

type IParams = {
  conversationId: string;
};

const ConversationId = async ({ params }: { params: IParams }) => {
  const [convo, messages] = await Promise.all([
    getConversationById(params.conversationId),
    getMessages(params.conversationId),
  ]);

  if (!convo) {
    return (
      <div className="h-full lg:pl-80">
        <div className="flex h-full flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full lg:pl-80">
      <div className="flex h-full flex-col">
        <Header convo={convo} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
