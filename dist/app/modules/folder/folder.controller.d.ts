import type { NextFunction, Request, Response } from "express";
export declare const FolderController: {
    createFolder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllFolders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getFolderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateFolder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteFolder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=folder.controller.d.ts.map