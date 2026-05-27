import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { PermissionServices } from "./permission.service.ts";
import { pick } from "../../../shared/pick.ts";
import { permissionFilterableFields } from "./permission.constant.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const createPermission = catchAsync(async (req, res) => {
  const result = await PermissionServices.createPermission(
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Permission created successfully!",
    data: result,
  });
});

const getAllPermission = catchAsync(async (req, res) => {
  const query = pick(req.query, permissionFilterableFields);
  const result = await PermissionServices.getAllPermission(
    query,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Permissions retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getPermissionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PermissionServices.getPermissionById(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission retrieved successfully!",
    data: result,
  });
});

const getPermissionsByRole = catchAsync(async (req, res) => {
  const { roleId } = req.params;
  const result = await PermissionServices.getPermissionsByRole(
    roleId as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions for role retrieved successfully!",
    data: result,
  });
});

const updatePermission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PermissionServices.updatePermission(
    id as string,
    req.body,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission updated successfully!",
    data: result,
  });
});

const deletePermission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PermissionServices.deletePermission(
    id as string,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permission deleted successfully!",
    data: result,
  });
});

const replacePermissionsForRole = catchAsync(async (req, res) => {
  const { roleId } = req.params;
  const { permissions } = req.body as {
    permissions: { module: string; permissions: string[] }[];
  };
  const result = await PermissionServices.replacePermissionsForRole(
    roleId as string,
    permissions,
    actorFromReq(req),
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions synced successfully!",
    data: result,
  });
});

export const PermissionControllers = {
  createPermission,
  getAllPermission,
  getPermissionById,
  getPermissionsByRole,
  updatePermission,
  deletePermission,
  replacePermissionsForRole,
};
