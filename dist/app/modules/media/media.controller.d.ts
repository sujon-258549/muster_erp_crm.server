import type { Request, Response } from "express";
export declare const MediaControllers: {
    createFolder: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllFolders: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getFolderById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateFolder: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteFolder: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createImage: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getImages: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteImage: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateImage: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=media.controller.d.ts.map