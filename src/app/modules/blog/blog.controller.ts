import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { BlogServices } from "./blog.service.ts";
import { pick } from "../../../shared/pick.ts";
import { blogFilterableFields } from "./blog.constant.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlog(req.body, actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully!",
    data: result,
  });
});

const getAllBlog = catchAsync(async (req, res) => {
  const query = pick(req.query, blogFilterableFields);
  const result = await BlogServices.getAllBlog(query, actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Blogs retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getBlogById = catchAsync(async (req, res) => {
  const result = await BlogServices.getBlogById(
    req.params.id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully!",
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.updateBlog(
    req.params.id as string,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully!",
    data: result,
  });
});

const updateBlogStatus = catchAsync(async (req, res) => {
  const result = await BlogServices.updateBlogStatus(
    req.params.id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog status updated successfully!",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const result = await BlogServices.deleteBlog(
    req.params.id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully!",
    data: result,
  });
});

export const BlogControllers = {
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
};
