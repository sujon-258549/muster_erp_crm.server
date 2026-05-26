import { Router } from "express";
import { UserController } from "./user.controller.js";
import auth from "../../utils/auth.ts";
import requirePermission from "../../middleware/requirePermission.ts";

// `employees` module key matches the frontend PERMISSION_ITEMS entry
// for the "Employee List" sub-module. /my-data + /change-password are
// per-user actions so they only need auth().
const router = Router();

router.post(
  "/create-employ",
  auth(),
  requirePermission("employees", "create"),
  UserController.createUser,
);

router.get(
  "/",
  auth(),
  requirePermission("employees", "read"),
  UserController.getAllUsers,
);
router.get("/my-data", auth(), UserController.getMyData);
router.get(
  "/:id",
  auth(),
  requirePermission("employees", "read"),
  UserController.getUserById,
);
router.patch("/change-password", auth(), UserController.changePassword);
router.post("/varify-otp", UserController.varifyOtp);
router.patch(
  "/:id",
  auth(),
  requirePermission("employees", "update"),
  UserController.updateUser,
);
router.delete(
  "/:id",
  auth(),
  requirePermission("employees", "delete"),
  UserController.deleteUser,
);
router.patch(
  "/:id/soft-delete",
  auth(),
  requirePermission("employees", "delete"),
  UserController.softDeleteUser,
);
router.patch(
  "/:id/block",
  auth(),
  requirePermission("employees", "update"),
  UserController.blockUser,
);
export const UserRouter = router;
