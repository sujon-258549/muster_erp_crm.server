import type { NextFunction, Request, Response } from "express";
import { USER_ROLE } from "../modules/users/user.constant.ts";
import catchAsync from "../shared/catchAsync.ts";
import ApiError from "../middleware/apiError.ts";
import status from "http-status";
import { JwtHelpers } from "./jwtHelpers.ts";
import config from "../config/index.ts";
import prisma from "./prismaClient.ts";

type UserRoleValue = (typeof USER_ROLE)[keyof typeof USER_ROLE];

const auth = (...requiredRoles: UserRoleValue[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;

    if (!token) {
      throw new ApiError(status.UNAUTHORIZED, "🔍❓ Unauthorized: Token missing");
    }

    let actualToken = token;
    if (token.startsWith("Bearer ")) {
      actualToken = token.split(" ")[1] || "";
    }

    let decoded;
    try {
      decoded = JwtHelpers.verifyToken(
        actualToken,
        config.accessSecret as string,
      );
    } catch (error: any) {
      // Specifically throw 401 for JWT errors (expired, invalid)
      throw new ApiError(status.UNAUTHORIZED, "🔍❓ Unauthorized: Token expired or invalid");
    }

    const email = decoded?.data?.email || "";
    const { iat, exp } = decoded as { iat: number; exp: number };
    const remainingTime = exp - Math.floor(Date.now() / 1000);
    console.log(`🔍 [Auth] Token for ${email} expires in: ${remainingTime}s`);

    const existingUser = await prisma.user.findFirst({
      where: { email },
      include: { role: true },
    });

    if (!existingUser) {
      throw new ApiError(status.UNAUTHORIZED, "🔍❓ Unauthorized: User not found");
    }

    if (existingUser.isBlocked) {
      throw new ApiError(status.UNAUTHORIZED, "🔍❓ Unauthorized: User is blocked");
    }

    const userRoleString = existingUser.role?.role;

    if (existingUser.passwordChangeTime) {
      const passwordChangeTimestamp: number = Math.floor(
        new Date(existingUser.passwordChangeTime).getTime() / 1000,
      );

      if (Number(passwordChangeTimestamp) > Number(iat)) {
        throw new ApiError(
          status.UNAUTHORIZED,
          "User recently changed password. Please login again.",
        );
      }
    }

    if (
      requiredRoles.length > 0 &&
      (!userRoleString || !requiredRoles.includes(userRoleString as any))
    ) {
      throw new ApiError(status.FORBIDDEN, "🔍❓ Forbidden: Access denied");
    }

    req.user = {
      id: existingUser.id,
      email: existingUser.email ?? "",
      role: userRoleString,
      mobile: existingUser.mobile ?? "",
    };

    // Tenant context resolution
    const headerBranchId = req.headers["x-branch-id"];
    const headerSubBranchId = req.headers["x-sub-branch-id"];
    const isPlatformAdmin =
      userRoleString === USER_ROLE.SUPER_ADMIN ||
      userRoleString === USER_ROLE.ADMIN;

    const requestedBranchId = Array.isArray(headerBranchId)
      ? headerBranchId[0]
      : headerBranchId;
    const requestedSubBranchId = Array.isArray(headerSubBranchId)
      ? headerSubBranchId[0]
      : headerSubBranchId;

    if (requestedBranchId) {
      if (!isPlatformAdmin) {
        const branch = await prisma.mainBranch.findFirst({
          where: {
            id: requestedBranchId,
            isDeleted: false,
            OR: [
              { ownerId: existingUser.id },
              { employees: { some: { id: existingUser.id } } },
            ],
          },
        });
        if (!branch) {
          throw new ApiError(
            status.FORBIDDEN,
            "🔍❓ Forbidden: No access to this branch",
          );
        }
      }
      req.branchId = requestedBranchId;
    } else if (!isPlatformAdmin) {
      // Fall back to user's own branch membership
      if (existingUser.branchId) {
        req.branchId = existingUser.branchId;
      }
    }

    if (requestedSubBranchId) {
      if (!isPlatformAdmin) {
        if (!req.branchId) {
          throw new ApiError(
            status.FORBIDDEN,
            "🔍❓ Forbidden: Branch context required for sub-branch access",
          );
        }
        const subBranch = await prisma.subBranch.findFirst({
          where: {
            id: requestedSubBranchId,
            isDeleted: false,
            branchId: req.branchId,
          },
        });
        if (!subBranch) {
          throw new ApiError(
            status.FORBIDDEN,
            "🔍❓ Forbidden: No access to this sub-branch",
          );
        }
      }
      req.subBranchId = requestedSubBranchId;
    } else if (!isPlatformAdmin && existingUser.subBranchId) {
      req.subBranchId = existingUser.subBranchId;
    }

    next();
  });
};

export default auth;
