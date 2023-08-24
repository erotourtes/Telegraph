import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";

interface ChatI {
  chat_id: number;
  name: string;
  created_at: string;
  user_id1: number;
  user_id2: number;
}

const fetchAllChats = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/chat/all-chats`, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    console.log({ error: "Can't get chats" });
    return { data: { chats: [] } };
  }

  return await response.json();
};

interface Props {
  setChatId: (chatId: number) => void;
}

function AvaliableChats({ setChatId }: Props) {
  const [chats, setChats] = useState<ChatI[]>([]);

  useEffect(() => {
    async function getAllChats() {
      const {
        data: { chats },
      } = await fetchAllChats();
      chats as ChatI[];

      setChats(chats);
      console.log(chats);
    }

    getAllChats();
  }, []);

  const chatsList = chats.map((chat) => (
    <li key={chat.chat_id}>
      <p onClick={() => setChatId(chat.chat_id)}>{chat.name}</p>
    </li>
  ));

  return (
    <>
      <div>
        <h1>Chats</h1>
        <ul>{chatsList}</ul>
      </div>
    </>
  );
}

export default AvaliableChats;
