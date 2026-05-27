import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import prisma from "../utils/prismaClient.ts";
import ApiError from "./apiError.ts";
import catchAsync from "../shared/catchAsync.ts";
import { USER_ROLE } from "../modules/users/user.constant.ts";

// Drop-in middleware that runs AFTER `auth()` and checks whether the
// signed-in user's role has the given module + action granted in the
// RolePermission table. Super-admins bypass every check.
//
// Usage:
//   router.get(
//     "/",
//     auth(),
//     requirePermission("employees", "read"),
//     UserController.getAllUsers,
//   );
//
// `action` accepts any string so custom verbs (e.g. "permission",
// "change_password", "view_own") work without a type change. Module keys
// match the frontend `PERMISSION_CATALOG`.
const requirePermission = (moduleKey: string, action?: string) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(status.UNAUTHORIZED, "🔍❓ Unauthorized");
      }

      // Super-admin shortcut — bypass the lookup entirely.
      if (req.user?.role === USER_ROLE.SUPER_ADMIN) {
        return next();
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { roleId: true },
      });
      if (!user?.roleId) {
        throw new ApiError(
          status.FORBIDDEN,
          `🔒 No role assigned — access to "${moduleKey}" denied`,
        );
      }

      const row = await prisma.rolePermission.findFirst({
        where: { roleId: user.roleId, module: moduleKey },
        select: { permissions: true },
      });
      if (!row) {
        throw new ApiError(
          status.FORBIDDEN,
          `🔒 Permission for "${moduleKey}" not granted`,
        );
      }

      // No specific action requested → just module-level access is enough.
      if (!action) return next();

      if (!row.permissions.includes(action)) {
        throw new ApiError(
          status.FORBIDDEN,
          `🔒 "${action}" on "${moduleKey}" not allowed`,
        );
      }

      next();
    },
  );
};

export default requirePermission;
