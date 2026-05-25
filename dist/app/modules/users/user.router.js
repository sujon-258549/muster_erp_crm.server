import { Router } from "express";
import { UserController } from "./user.controller.js";
const router = Router();
router.post("/create-user", UserController.createUser);
export const UserRouter = router;
//# sourceMappingURL=user.router.js.map