import { IUserRole } from "../app/modules/users/user.interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: IUserRole;
        mobile?: string;
      };
      branchId?: string;
      subBranchId?: string;
    }
  }
}

export {};
