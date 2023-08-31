export const form = {
  form: {
    display: "flex",
    alignItems: "center",
    alignContent: "left",
    flexDirection: "column",
    border: "1px solid black",
    padding: "1rem",
  },
  div: {
    width: "100%",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
  },
  input: {
    marginLeft: "1rem",
  },
  button: {
    display: "block",
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: "0",
  },
};


export const chats = {
  container: {
    display: "grid",
    gridTemplateColumns: "250px [end]",
  },
  left: {
    backgroundColor: "red",
    gridColumn: "1 / 2",
    height: "100vh",
  },
  right: {
    backgroundColor: "blue",
    gridColumn: "2 / end",
    height: "100vh",
    position: "relative",
  },
  text: {
    textAlign: "center",
    userSelect: "none",
    cursor: "pointer",
    borderBottom: "1px solid black",
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  button: {
    display: "block",
    margin: "0.1rem",
    width: "80%",
  },
  hidden: {
    display: "none",
  },
};

