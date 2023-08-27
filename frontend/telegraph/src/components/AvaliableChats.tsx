import { useEffect } from "react";
import { BASE_URL } from "../constants";
import { ChatI } from "../interfaces";

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
  curChatId: number;
  chats: ChatI[];
  setChats: (chats: ChatI[]) => void;
}

function AvaliableChats({ setChatId: setCurrChatId, curChatId, chats, setChats }: Props) {
  useEffect(() => {
    async function getAllChats() {
      const {
        data: { chats },
      } = await fetchAllChats();
      chats as ChatI[];

      setChats(chats);
    }

    getAllChats();
  }, []);

  const chatsList = chats.map((chat) => (
    <li key={chat.chat_id}>
      <p style={{
        color: curChatId === chat.chat_id ? "red" : ""
      }} onClick={() => setCurrChatId(chat.chat_id)}>{chat.name}</p>
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
