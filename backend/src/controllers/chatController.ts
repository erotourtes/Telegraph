import { RequestHandler } from "express";
import * as chatService from "../services/chatService.js";

export const getMessages: RequestHandler = async (req, res, next) => {
  const chatId = req.params.chatId;

  // const messages = await chatService
  //   .getMessages({ chatId: +chatId })
  //   .catch((err) => {
  //     console.log(err);
  //     return null;
  //   });
  const messages = "hello";

  console.log("user is ", req.user);

  console.log(messages);

  res.status(200).json({ status: "success", data: { messages } });
};
