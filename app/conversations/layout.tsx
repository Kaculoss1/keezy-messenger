import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import { Sidebar } from "../components/sidebar";
import { ConversationList } from "./components";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [convos, users] = await Promise.all([getConversations(), getUsers()]);

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <ConversationList users={users} initialItems={convos} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
