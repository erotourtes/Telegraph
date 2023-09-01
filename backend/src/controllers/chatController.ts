import { RequestHandler } from "express";
import * as chatService from "../services/chatService.js";

export const getMessages: RequestHandler = async (req, res, next) => {
  throw new Error("Implemented getMessagesByChatId");
  // const user = req.user;
  // const anotherUser = req.params.username;
  //
  // if (!user || !anotherUser) return next(new Error("Cannot get messages"));
  //
  // const messages = await chatService
  //   .getChatId({ userId: user.id, username: anotherUser })
  //   .catch((err) => {
  //     console.log(err);
  //     return null;
  //   });
  //
  // if (!messages) return next(new Error("Cannot get messages"));
  //
  // res.status(200).json({ success: true, data: { messages } });
};

export const getMessagesByChatId: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const chatId = req.query.chatId;
  const skip = +(req.query.skip ?? 0);
  const numOfMessagesInPage = req.query.numOfMessages;

  if (numOfMessagesInPage === undefined)
    return next(new Error("numOfMessages is not defined"));
  if (chatId === undefined) return next(new Error("chatId is not defined"));

  if (!user || !chatId) return next(new Error("Cannot get messages"));

  const messages = await chatService
    .getChatMessagesByChatId({
      userId: user.user_id,
      chatId: +chatId,
      skip,
      take: +numOfMessagesInPage,
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!messages) return next(new Error("Cannot get messages"));

  res.status(200).json({ success: true, data: { messages } });
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

  res.status(200).json({ success: true, data: { chats } });
};

export const createChatByUsername: RequestHandler = async (req, res, next) => {
  const username = req.params.username;
  const user = req.user;

  if (!username || !user)
    throw new Error("Username is not defined, or you're not logged in");

  const chat = await chatService
    .createChat({
      username2: username,
      username1: user.username,
      userId: user.user_id,
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!chat)
    return next(new Error("Cannot create a chat; Maybe user doesn't exist"));

  res
    .status(200)
    .json({ success: true, message: "Created chat", data: { chat } });
};
