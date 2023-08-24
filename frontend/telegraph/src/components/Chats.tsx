import { useState } from "react";
import AvaliableChats from "./AvaliableChats";
import ChatMessges from "./ChatMessages";
import { useAuth } from "./Auth/AuthContext";

function Chats() {
  const [chatId, setChatId] = useState<number>(0);
  const { isLoggedIn } = useAuth();

  return (
    <>
      {!isLoggedIn && <h1>Sign in to see chats</h1>}

      {isLoggedIn && (
        <div>
          <AvaliableChats setChatId={setChatId} />
          {chatId !== 0 && <ChatMessges chatId={chatId} />}
        </div>
      )}
    </>
  );
}

export default Chats;
