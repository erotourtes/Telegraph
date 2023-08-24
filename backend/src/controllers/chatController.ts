import { RequestHandler } from "express";
import * as chatService from "../services/chatService.js";

export const getMessages: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const anotherUser = req.params.username;

  if (!user || !anotherUser) return next(new Error("Cannot get messages"));

  const messages = await chatService
    .getChatId({ userId: user.id, username: anotherUser })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!messages) return next(new Error("Cannot get messages"));

  res.status(200).json({ status: "success", data: { messages } });
};

export const getMessagesByChatId: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const chatId = req.params.chatId;

  if (!user || !chatId) return next(new Error("Cannot get messages"));

  const messages = await chatService
    .getChatMessagesByChatId({ userId: user.user_id, chatId: +chatId })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!messages) return next(new Error("Cannot get messages"));

  res.status(200).json({ status: "success", data: { messages } });
};

export const getChats: RequestHandler = async (req, res, next) => {
  const user = req.user;

  if (!user) return next(new Error("Cannot get chats"));

  const chats = await chatService
    .getAllUserChats({ userId: user.user_id })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!chats) return next(new Error("Cannot get chats"));

  res.status(200).json({ status: "success", data: { chats } });
};
