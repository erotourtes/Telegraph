import { useState } from "react";
import AvaliableChats from "./AvaliableChats";
import CreateChat from "./CreateChatForm";
import { ChatI } from "../interfaces";
import ChatContainer from "./ChatContainer";

function Chats() {
  const [chatId, setChatId] = useState<number>(0);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatI[]>([]);

  return (
    <>
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
