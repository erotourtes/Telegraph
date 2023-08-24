import { useState } from "react";
import AvaliableChats from "./AvaliableChats";
import ChatMessges from "./ChatMessages";


function Chats() {
  const [chatId, setChatId] = useState<number>(0);

  console.log(chatId)

  return (
    <>
      <AvaliableChats setChatId={setChatId}/>
      {
        chatId !== 0 && <ChatMessges chatId={chatId} />
      }
    </>
  )
}

export default Chats;
