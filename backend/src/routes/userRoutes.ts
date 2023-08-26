import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.signin);
router.get("/is-logged-in", authController.protect, authController.isLoggedIn);
router.post("/logout", authController.logOut);

export default router;
