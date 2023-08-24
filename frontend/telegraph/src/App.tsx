import "./App.css";
import { useAuth } from "./components/Auth/AuthContext";
import Chats from "./components/Chats";
import GreetForm from "./components/GreetForm";

function App() {
  const { isLoggedIn } = useAuth();
  return <>{isLoggedIn ? <Chats /> : <GreetForm />}</>;
}

export default App;
