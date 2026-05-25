import express from "express";
import { CommentControllers } from "./comment.controller.ts";
import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  auth(
    USER_ROLE.USER,
    USER_ROLE.WORKER,
    USER_ROLE.EMPLOYEE,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ),
  CommentControllers.createComment,
);

router.get("/", CommentControllers.getAllComments);

router.get("/:id", CommentControllers.getCommentById);

router.patch(
  "/:id",
  auth(
    USER_ROLE.USER,
    USER_ROLE.WORKER,
    USER_ROLE.EMPLOYEE,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ),
  CommentControllers.updateComment,
);

router.delete(
  "/:id",
  auth(
    USER_ROLE.USER,
    USER_ROLE.WORKER,
    USER_ROLE.EMPLOYEE,
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
  ),
  CommentControllers.deleteComment,
);

export const CommentRoutes = router;
