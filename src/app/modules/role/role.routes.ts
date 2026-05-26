import express from "express";
import { RoleControllers } from "./role.controller.ts";
import auth from "../../utils/auth.ts";
import requirePermission from "../../middleware/requirePermission.ts";

const router = express.Router();

router.post(
  "/",
  auth(),
  requirePermission("roles", "create"),
  RoleControllers.createRole,
);
router.get(
  "/",
  auth(),
  requirePermission("roles", "read"),
  RoleControllers.getAllRole,
);
router.get(
  "/:id",
  auth(),
  requirePermission("roles", "read"),
  RoleControllers.getRoleById,
);
router.put(
  "/:id",
  auth(),
  requirePermission("roles", "update"),
  RoleControllers.updateRole,
);
router.delete(
  "/:id",
  auth(),
  requirePermission("roles", "delete"),
  RoleControllers.deleteRole,
);
router.patch(
  "/:id/status",
  auth(),
  requirePermission("roles", "update"),
  RoleControllers.updateRoleStatus,
);

export const RoleRoutes = router;
