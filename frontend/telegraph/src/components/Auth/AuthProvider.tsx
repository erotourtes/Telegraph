import { ReactNode, useEffect, useState } from "react";
import AuthContext from "./AuthContext.ts";
import { BASE_URL } from "../../constants.ts";
import { UserDBI } from "@/interfaces.ts";

const checkIfUserIsLoggedIn = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/user/is-logged-in`, {
    credentials: "include",
    method: "GET",
  });

  return await response.json();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<null | UserDBI>(null);

  useEffect(() => {
    async function checkIfLoggedIn() {
      const {
        data: { isLoggedIn, user },
      } = await checkIfUserIsLoggedIn().catch((err) => {
        console.log(err);
        return { data: { isLoggedIn: false, user: null } };
      });

      console.log("is logged in: ", isLoggedIn);
      setIsLoggedIn(Boolean(isLoggedIn));
      setUser(user);
    }

    window.addEventListener("load", () => {
      console.log("load event fired");
      checkIfLoggedIn();
    });

    // causes infinite loop without a dependency array, because isLoggedIn is not changed, but user is send new
    checkIfLoggedIn();

    return () => {
      window.removeEventListener("load", checkIfLoggedIn);
    };
  }, [isLoggedIn]);
  // }); // infinite loop with setUser()

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};
