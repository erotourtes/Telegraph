import { useContext, createContext } from "react";
import AuthContext from "./AuthContext";

export default createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {
    value;
  },
});

export const useAuth = () => useContext(AuthContext);
