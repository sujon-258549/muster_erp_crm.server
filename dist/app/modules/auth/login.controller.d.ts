import type { NextFunction, Request, Response } from "express";
export declare const AuthController: {
    loginUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createRefreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    logoutUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    forgotPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=login.controller.d.ts.map