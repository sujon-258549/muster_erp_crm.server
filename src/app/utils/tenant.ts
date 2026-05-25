import { USER_ROLE } from "../modules/users/user.constant.ts";
import ApiError from "../middleware/apiError.ts";
import httpStatus from "http-status";

export type ActorContext = {
  userId: string;
  role: string | undefined;
  branchId?: string | undefined;
  subBranchId?: string | undefined;
};

export const isPlatformAdmin = (role: string | undefined): boolean =>
  role === USER_ROLE.SUPER_ADMIN || role === USER_ROLE.ADMIN;

// Returns a Prisma where-clause fragment for tenant scoping.
// Platform admins get no filter (see all). Others are scoped to their branchId.
export const tenantFilter = (
  actor: ActorContext,
): { branchId?: string | null } => {
  if (isPlatformAdmin(actor.role)) return {};
  return { branchId: actor.branchId ?? null };
};

// Throws if the caller has no branch context (non-admin without active Branch).
export const requireBranch = (actor: ActorContext): string => {
  if (isPlatformAdmin(actor.role) && !actor.branchId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Branch context required (set x-branch-id header)",
    );
  }
  if (!actor.branchId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Active branch required. Subscribe and create a branch first.",
    );
  }
  return actor.branchId;
};

// Asserts a record belongs to the caller's tenant (admins bypass).
export const assertTenantAccess = (
  actor: ActorContext,
  recordBranchId: string | null,
): void => {
  if (isPlatformAdmin(actor.role)) return;
  if (recordBranchId !== actor.branchId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Resource belongs to another branch");
  }
};

// Extract actor from Express request (used by controllers).
import type { Request } from "express";
export const actorFromReq = (req: Request): ActorContext => ({
  userId: req.user?.id as string,
  role: req.user?.role,
  branchId: req.branchId,
  subBranchId: req.subBranchId,
});
