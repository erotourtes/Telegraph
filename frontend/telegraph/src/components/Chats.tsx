import { useState } from "react";
import AvaliableChats from "./AvaliableChats";
import ChatMessges from "./ChatMessages";
import CreateChat from "./CreateChatForm";
import { BASE_URL } from "../constants";
import { ChatI } from "../interfaces";

const fetchSendMessage = async (chatId: number, content: string) => {
  console.log("sending message for chat: ", chatId);
  const response = await fetch(
    `${BASE_URL}/api/v1/chat/messages/send-message/${chatId}`,
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  return await response.json();
};

function Chats() {
  const [chatId, setChatId] = useState<number>(0);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatI[]>([]);

  const [message, setMessage] = useState<string>("");

  return (
    <>
      <AvaliableChats
        setChatId={setChatId}
        curChatId={chatId}
        chats={chats}
        setChats={(value: ChatI[]) => setChats(value)}
      />
      <button onClick={() => setIsCreateMode(!isCreateMode)}
      >
        {!isCreateMode ? "Create new chat" : "Cancel"}
      </button>
      {isCreateMode && (
        <CreateChat
          setCreatedChat={(value: ChatI) => setChats([...chats, value])}
          setIsCreatingMode={(value: boolean) => setIsCreateMode(value)}
        />
      )}
      {chatId !== 0 && <ChatMessges chatId={chatId} />}

      {chatId !== 0 && (
        <>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() => {
              fetchSendMessage(chatId, message);
            }}
          >
            Send
          </button>
        </>
      )}
    </>
  );
}

export default Chats;
