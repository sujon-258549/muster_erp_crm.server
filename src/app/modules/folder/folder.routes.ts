import { Router } from "express";
import { FolderController } from "./folder.controller.ts";

const router = Router();

router.post("/", FolderController.createFolder);
router.get("/", FolderController.getAllFolders);
router.get("/:id", FolderController.getFolderById);
router.put("/:id", FolderController.updateFolder);
router.delete("/:id", FolderController.deleteFolder);

export const FolderRoutes = router;
