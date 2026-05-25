import express from "express";
import { RoleControllers } from "./role.controller.ts";


import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post("/", auth(), RoleControllers.createRole);
router.get("/", auth(), RoleControllers.getAllRole);
router.get("/:id", auth(), RoleControllers.getRoleById);
router.put("/:id", auth(), RoleControllers.updateRole);
router.delete("/:id", auth(), RoleControllers.deleteRole);
router.patch("/:id/status", auth(), RoleControllers.updateRoleStatus);

export const RoleRoutes = router;
