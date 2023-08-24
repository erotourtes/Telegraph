import express from "express";
import * as authController from "../controllers/authController.js";
import * as chatController from "../controllers/chatController.js";

const router = express.Router();

router.get(
  "/messages/:username",
  authController.protect,
  chatController.getMessages,
);
router.get("/all-chats", authController.protect, chatController.getChats);

router.get(
  "/messages/chat/:chatId",
  authController.protect,
  chatController.getMessagesByChatId,
);

export default router;
