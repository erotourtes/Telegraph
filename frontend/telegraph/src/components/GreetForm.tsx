import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const styles = {
  form: {
    width: "100%",
    height: "100vh",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginBlock: "1rem",
  },
};

function GreetForm() {
  const [isSignInMode, setIsSignInMode] = useState(true);

  return (
    <>
      <div style={styles.form as React.CSSProperties}>
        {isSignInMode ? (
          <>
            <button
              style={styles.button}
              onClick={() => setIsSignInMode(false)}
            >
              Sign up
            </button>
            <SignIn />
          </>
        ) : (
          <>
            <button style={styles.button} onClick={() => setIsSignInMode(true)}>
              Sign in
            </button>
            <SignUp />
          </>
        )}
      </div>
    </>
  );
}

export default GreetForm;
