import { useState } from "react";
import { BASE_URL } from "../constants.js";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { success, message, data } = await fetchUserLogIn(email, password);

    if (!success) setError(message);
    else setError(null);

    console.log(success, message, data);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>

        {error && <p>{error}</p>}
      </form>
    </>
  );
}

export default SignIn;
