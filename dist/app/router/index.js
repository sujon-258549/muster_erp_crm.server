import { Router } from "express";
import { UserRouter } from "../modules/users/user.router.js";
const router = Router();
const allRouter = [
    {
        path: '/user',
        router: UserRouter
    }
];
allRouter.forEach((route) => router.use(route.path, route.router));
export default router;
//# sourceMappingURL=index.js.map