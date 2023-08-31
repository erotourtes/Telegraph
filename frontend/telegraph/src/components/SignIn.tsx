import { useState } from "react";
import { BASE_URL } from "../constants.js";
import { useAuth } from "./Auth/AuthContext.js";
import { form as styles } from "./Styles/object.ts";

const fetchUserLogIn = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
    method: "POST",
    credentials: "include", // Needed to include the cookie
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return await response.json();
};

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const { setIsLoggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { success, message, data } = await fetchUserLogIn(email, password);

    if (!success) setError(message);
    else setError(null);

    setIsLoggedIn(success);
    console.log(success, message, data);
  };

  return (
    <>
      <form style={styles.form as React.CSSProperties} onSubmit={handleSubmit}>
        <div style={styles.div}>
          <label htmlFor="email">Email</label>
          <input
            style={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.div}>
          <label htmlFor="password">Password</label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button style={styles.button} type="submit">
          Submit
        </button>

        {error && (
          <div>
            <p style={styles.error}>{error}</p>
            {(email || password) && (
              <button
                style={styles.button}
                onClick={() => {
                  setEmail("");
                  setPassword("");
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </form>
    </>
  );
}

export default SignIn;
