import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { RoleServices } from "./role.service.ts";
import { pick } from "../../../shared/pick.ts";
import { roleFilterableFields } from "./role.constant.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createRole = catchAsync(async (req, res) => {
  const result = await RoleServices.createRole(req.body, actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Role created successfully!",
    data: result,
  });
});

const getAllRole = catchAsync(async (req, res) => {
  const query = pick(req.query, roleFilterableFields);
  const result = await RoleServices.getAllRole(query, actorFromReq(req));
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Roles retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getRoleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoleServices.getRoleById(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role retrieved successfully!",
    data: result,
  });
});

const updateRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoleServices.updateRole(
    id as string,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role updated successfully!",
    data: result,
  });
});

const deleteRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoleServices.deleteRole(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role deleted successfully!",
    data: result,
  });
});

const updateRoleStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoleServices.updateRoleStatus(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role status updated successfully!",
    data: result,
  });
});

export const RoleControllers = {
  createRole,
  getAllRole,
  getRoleById,
  updateRole,
  deleteRole,
  updateRoleStatus,
};
