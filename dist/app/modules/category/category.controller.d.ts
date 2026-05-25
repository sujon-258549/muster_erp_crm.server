import type { NextFunction, Request, Response } from "express";
export declare const CategoryController: {
    createCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCategoryById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateCategoryStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=category.controller.d.ts.map