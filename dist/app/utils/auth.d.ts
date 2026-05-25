import type { NextFunction, Request, Response } from "express";
import { USER_ROLE } from "../modules/users/user.constant.ts";
type UserRoleValue = (typeof USER_ROLE)[keyof typeof USER_ROLE];
declare const auth: (...requiredRoles: UserRoleValue[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default auth;
//# sourceMappingURL=auth.d.ts.map