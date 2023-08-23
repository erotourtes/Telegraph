import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

function GreetForm() {
  const [isSignInMode, setIsSignInMode] = useState(true);

  return (
    <>
      <button onClick={() => setIsSignInMode(true)}>Sign in</button>
      <button onClick={() => setIsSignInMode(false)}>Sign up</button>

      {isSignInMode ? <SignIn /> : <SignUp />}
    </>
  );
}

export default GreetForm;
