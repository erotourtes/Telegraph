import { useState } from "react";
import { BASE_URL } from "../constants";

const fetchUserSignUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const response = await fetch(`${BASE_URL}/api/v1/user/signup`, {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName }),
  });

  const user = await response.json();
  return user;
};

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = await fetchUserSignUp(email, password, firstName, lastName);
    console.log(user);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first-name">First Name</label>
        <input
          required
          type="text"
          id="first-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <br />

        <label htmlFor="last-name">Last Name</label>
        <input
          required
          type="text"
          id="last-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <br />

        <label htmlFor="email">Email</label>
        <input
          required
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <label htmlFor="password">Password</label>
        <input
          required
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />

        <label htmlFor="password">Confirm Password</label>
        <input
          required
          type="password"
          id="confirm-password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        {password !== passwordConfirmation && <p>Passwords do not match</p>}

        <br />

        <button disabled={password !== passwordConfirmation} type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default SignUp;
