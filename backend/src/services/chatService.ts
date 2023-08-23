import * as query from "../sql/sql.js";

export const getMessages = async ({ chatId }: { chatId: number }) => {
  const [rows] = await query.getChatMessagesQuery({ chatId });

  return rows;
};
