import { ReactNode, useEffect, useState } from "react";
import AuthContext from "./AuthContext.ts";
import { BASE_URL } from "../../constants.ts";

const checkIfUserIsLoggedIn = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/user/is-logged-in`, {
    credentials: "include",
    method: "GET",
  });

  return await response.json();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkIfLoggedIn() {
      const {
        data: { isLoggedIn },
      } = await checkIfUserIsLoggedIn();
      console.log("is logged in: ", isLoggedIn);
      setIsLoggedIn(Boolean(isLoggedIn));
    }

    window.addEventListener("load", checkIfLoggedIn);

    checkIfLoggedIn();

    return () => {
      window.removeEventListener("load", checkIfLoggedIn);
    };
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
