import { useState } from "react";
import { BASE_URL } from "../constants";
import { ChatI } from "../interfaces";

interface Props {
  setIsCreatingMode: (isCreatingMode: boolean) => void;
  setCreatedChat: (chat: ChatI) => void;
}

const createChatFetch = async (username: string) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/chat/create-chat/${username}`,
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((err) => {
    console.log(err);
    return { ok: false } as Response;
  });

  if (!response.ok)
    return { success: false, message: "Server is shutted down?" };

  return response.json();
};

function CreateChat({ setIsCreatingMode, setCreatedChat }: Props) {
  const [username, setUsername] = useState("");
  const [isSuccess, setIsSucces] = useState<boolean | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    if (username.length == 0) return;

    const { success, data, message } = await createChatFetch(username);
    console.log(success, data, message);

    setIsSucces(success);
    setIsSending(false);
    if (success) {
      setIsCreatingMode(false);
      setCreatedChat(data.chat);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Username"
        type="text"
        id="username"
        onChange={(e) => {
          const value = e.target.value;
          if (value.length == 0) setIsSucces(null);
          setUsername(value);
        }}
      />

      <button disabled={isSending} type="submit">
        Create
      </button>

      {isSuccess && <h1>Successfully created chat</h1>}
      {isSuccess !== null && !isSuccess && <h1>Failed to create chat</h1>}
    </form>
  );
}

export default CreateChat;
