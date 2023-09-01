import "./App.css";
import { useAuth } from "./components/Auth/AuthContext";
import { ChatProvider } from "./components/Chat/ChatProvider";
import Chats from "./components/Chats";
import GreetForm from "./components/GreetForm";

function App() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn ? (
        <ChatProvider>
          <Chats />
        </ChatProvider>
      ) : (
        <GreetForm />
      )}
    </>
  );
}

export default App;
