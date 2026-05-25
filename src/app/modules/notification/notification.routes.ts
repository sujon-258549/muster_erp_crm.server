import express from "express";
import { NotificationControllers } from "./notification.controller.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  NotificationControllers.createNotification,
);

router.get(
  "/",
  auth(
    USER_ROLE.USER,
    USER_ROLE.WORKER,
    USER_ROLE.EMPLOYEE,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ),
  NotificationControllers.getAllNotifications,
);

router.patch(
  "/mark-as-read",
  auth(USER_ROLE.USER, USER_ROLE.WORKER, USER_ROLE.EMPLOYEE),
  NotificationControllers.markAsRead,
);

router.get(
  "/:id",
  auth(
    USER_ROLE.USER,
    USER_ROLE.WORKER,
    USER_ROLE.EMPLOYEE,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ),
  NotificationControllers.getNotificationById,
);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  NotificationControllers.updateNotification,
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  NotificationControllers.deleteNotification,
);

export const NotificationRoutes = router;
