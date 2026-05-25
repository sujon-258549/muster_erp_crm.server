import type { NextFunction, Request, Response } from "express";
export declare const DepartmentController: {
    createDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getDepartmentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateDepartmentStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=department.controller.d.ts.map