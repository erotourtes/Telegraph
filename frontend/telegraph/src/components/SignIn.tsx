import { useState } from "react";
import { BASE_URL } from "../constants.js";

const fetchUserLogIn = async (email: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const user = await response.json();
  return user;
};

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = await fetchUserLogIn(email, password);
    console.log(user);
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
      </form>
    </>
  );
}

export default SignIn;
