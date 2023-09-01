import { useEffect } from "react";
import { BASE_URL } from "../constants";
import { ChatI } from "../interfaces";
import ws from "@/WS/WS";
import { useChat } from "./Chat/ChatContext";
import { useAuth } from "./Auth/AuthContext";

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
  const allmessages = useChat();
  const { user } = useAuth();

  const isUnreadMessages = (chatId: number) => {
    const messagesForChat = allmessages.messages[chatId];
    if (!messagesForChat) return false;

    const lastPage = messagesForChat[1];
    if (!lastPage) return false;

    const lastMessage = lastPage[lastPage.length - 1];

    if (!lastMessage) return false;

    return lastMessage.user_id !== user?.user_id && !lastMessage.isRead;
  };

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

  // for dynamic chat creation
  useEffect(() => {
    const cb = ({ chat }: { chat: ChatI }) => {
      setChats([...chats, chat]);
    };

    ws.on("chat-notify", cb);

    return () => {
      ws.removeListener("chat-notify", cb);
    };
  }, []);

  const chatsList = chats.map((chat) => (
    <div
      style={
        curChatId == chat.chat_id
          ? (styles.curChatDiv as React.CSSProperties)
          : styles.chatDiv
      }
      key={chat.chat_id}
    >
      <p onClick={() => setCurrChatId(chat.chat_id)}>
        {chat.name} {isUnreadMessages(chat.chat_id) ?? "New messages!"}
      </p>
    </div>
  ));

  return <>{chatsList}</>;
}

export default AvaliableChats;
