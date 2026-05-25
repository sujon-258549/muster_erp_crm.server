import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { CommentServices } from "./comment.service.ts";
import { pick } from "../../../shared/pick.ts";
import { commentFilterableFields } from "./comment.constant.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createComment = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await CommentServices.createComment(
    userId,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment added successfully!",
    data: result,
  });
});

const getAllComments = catchAsync(async (req, res) => {
  const query = pick(req.query, commentFilterableFields);
  const result = await CommentServices.getAllComments(query, actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getCommentById = catchAsync(async (req, res) => {
  const result = await CommentServices.getCommentById(
    req.params.id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment retrieved successfully!",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const result = await CommentServices.updateComment(
    req.params.id as string,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment updated successfully!",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const result = await CommentServices.deleteComment(
    req.params.id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully!",
    data: result,
  });
});

export const CommentControllers = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
