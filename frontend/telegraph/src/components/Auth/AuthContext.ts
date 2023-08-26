import { useContext, createContext } from "react";
import AuthContext from "./AuthContext";
import { UserI } from "@/interfaces";

export default createContext<{
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: null | UserI;
}>({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {
    value;
  },
  user: null
});

export const useAuth = () => useContext(AuthContext);
