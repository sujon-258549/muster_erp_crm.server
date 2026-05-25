import { Router } from "express";
import { AuthController } from "./login.controller.js";

const router = Router();

router.post("/login", AuthController.loginUser);
router.post("/refresh-token", AuthController.createRefreshToken);
router.post("/logout", AuthController.logoutUser);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
export const authRouter = router;
