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

const styles = {
  chatDiv: {
    backgroundColor: "red",
    padding: "0.3rem",
    margin: "0.5rem",
    borderRadius: "10px",
  },
  curChatDiv: {
    backgroundColor: "blue",
    padding: "0.3rem",
    margin: "0.5rem",
    borderRadius: "10px",
  },
};

function AvaliableChats({
  setChatId: setCurrChatId,
  curChatId,
  chats,
  setChats,
}: Props) {
  useEffect(() => {
    async function getAllChats() {
      const {
        data: { chats },
      } = await fetchAllChats();
      chats as ChatI[];

      setChats(chats);
    }

    getAllChats();
  }, []); // setting setChats as a dependency causes infinite loop

  const chatsList = chats.map((chat) => (
    <div style={curChatId == chat.chat_id ? styles.curChatDiv as React.CSSProperties : styles.chatDiv} key={chat.chat_id}>
      <p onClick={() => setCurrChatId(chat.chat_id)}>{chat.name}</p>
    </div>
  ));

  return <>{chatsList}</>;
}

export default AvaliableChats;
