import { useState } from "react";
import AvaliableChats from "./AvaliableChats";
import CreateChat from "./CreateChatForm";
import { ChatI } from "../interfaces";
import ChatContainer from "./ChatContainer";
import { BASE_URL } from "@/constants";
import { useAuth } from "./Auth/AuthContext";

const fetchLogout = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/user/logout`, {
    credentials: "include",
    method: "POST",
  });

  return await response.json();
};

function Chats() {
  const [chatId, setChatId] = useState<number>(0);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatI[]>([]);
  const { user, setIsLoggedIn } = useAuth();

  return (
    <>
      <h1>Welcome {user?.username}</h1>
      <button
        onClick={() =>
          fetchLogout().then((data) => setIsLoggedIn(!data.success))
        }
      >
        Logout
      </button>

      <AvaliableChats
        setChatId={setChatId}
        curChatId={chatId}
        chats={chats}
        setChats={(value: ChatI[]) => setChats(value)}
      />
      <button onClick={() => setIsCreateMode(!isCreateMode)}>
        {!isCreateMode ? "Create new chat" : "Cancel"}
      </button>
      {isCreateMode && (
        <CreateChat
          setCreatedChat={(value: ChatI) => setChats([...chats, value])}
          setIsCreatingMode={(value: boolean) => setIsCreateMode(value)}
        />
      )}

      <ChatContainer chatId={chatId} />
    </>
  );
}

export default Chats;
