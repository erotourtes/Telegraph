import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";

interface MessageI {
  message_id: number;
  chat_id: number;
  user_id: number;
  content: string;
  created_at: Date;
}

const fetchChatMessages = async (chatId: number) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/chat/messages/chat/${chatId}`,
    {
      credentials: "include",
      method: "GET",
    }
  );

  if (!response.ok) {
    console.log({ error: "Something went wrong, can't get messagse" });

    return { data: { messages: [] } };
  }

  return await response.json();
};

function ChatMessges({ chatId }: { chatId: number }) {
  const [messages, setMessages] = useState<MessageI[]>([]);

  useEffect(() => {
    async function messages() {
      const { data: { messages }} = await fetchChatMessages(chatId);
      setMessages(messages);
    }

    messages();
  }, [chatId]);

  const messagesList = messages.map((message) => (
    <li key={message.message_id}>
      <p>{message.content}</p>
    </li>
  ));

  return (
    <>
      <div>
        <h1>Messages</h1>
        <ul>{messagesList}</ul>
      </div>
    </>
  );
}

export default ChatMessges;
