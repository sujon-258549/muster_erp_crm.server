import { Router } from "express";
import { UserController } from "./user.controller.js";
import auth from "../../utils/auth.ts";
import {  USER_ROLE } from "./user.constant.ts";

const router = Router();

router.post("/create-employ", auth(), UserController.createUser);

router.get("/", auth(), UserController.getAllUsers);
router.get("/my-data", auth(), UserController.getMyData);
router.get("/:id", auth(), UserController.getUserById);
router.patch("/change-password", auth(), UserController.changePassword);
router.post("/varify-otp", UserController.varifyOtp);
router.patch("/:id", auth(), UserController.updateUser);
router.delete("/:id", auth(), UserController.deleteUser);
router.patch("/:id/soft-delete", auth(), UserController.softDeleteUser);
router.patch("/:id/block", auth(), UserController.blockUser);
export const UserRouter = router;
