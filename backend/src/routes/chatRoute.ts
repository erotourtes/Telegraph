import express from "express";
import * as authController from "../controllers/authController.js";
import * as chatController from "../controllers/chatController.js";


const router = express.Router();

router.get("/:chatId", authController.protect, chatController.getMessages);

export default router;
