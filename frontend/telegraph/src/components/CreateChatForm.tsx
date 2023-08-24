interface Props {
  setIsCreatingMode: (isCreatingMode: boolean) => void;
}

function CreateChat({ setIsCreatingMode }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingMode(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" />

      <button type="submit">Create</button>
    </form>
  );
}

export default CreateChat;
