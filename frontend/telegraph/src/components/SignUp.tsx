import { useState } from "react";
import { BASE_URL } from "../constants";
import { UserI } from "../interfaces";
import { form as styles } from "./Styles/object.ts";
import { useAuth } from "./Auth/AuthContext.ts";

const fetchUserSignUp = async (usr: UserI) => {
  const response = await fetch(`${BASE_URL}/api/v1/user/signup`, {
    method: "POST",
    credentials: "include", // Needed to include the cookie
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usr),
  });

  return await response.json();
};

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      data: { user },
    } = await fetchUserSignUp({
      email,
      password,
      firstName,
      secondName,
      username,
    }).catch((err) => {
      console.log(err);
      return { data: { user: null } };
    });

    console.log(user);
    if (user) auth.setIsLoggedIn(true);
  };

  return (
    <>
      <form style={styles.form as React.CSSProperties} onSubmit={handleSubmit}>
        <div style={styles.div}>
          <label htmlFor="first-name">First Name</label>
          <input
            required
            type="text"
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div style={styles.div}>
          <label htmlFor="last-name">Last Name</label>
          <input
            required
            type="text"
            id="last-name"
            value={secondName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div style={styles.div}>
          <label htmlFor="username">Username</label>
          <input
            required
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={styles.div}>
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.div}>
          <label htmlFor="password">Password</label>
          <input
            required
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div style={styles.div}>
          <label htmlFor="password">Confirm Password</label>
          <input
            required
            type="password"
            id="confirm-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>

        <button
          style={styles.button}
          disabled={password !== passwordConfirmation}
          type="submit"
        >
          Submit
        </button>

        {password !== passwordConfirmation && (
          <p style={styles.error}>Passwords do not match</p>
        )}
      </form>
    </>
  );
}

export default SignUp;
