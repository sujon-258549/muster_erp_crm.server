import * as argon2 from "argon2";
import prisma from "../../utils/prismaClient.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import ApiError from "../../middleware/apiError.ts";
import status from "http-status";
import { otpEmailTemplate, sendEmail } from "../../utils/sendEmail.ts";
import { JwtHelpers } from "../../utils/jwtHelpers.ts";
import config from "../../config/index.ts";
import { userSearchableFields } from "./user.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { derivePermissionKeys } from "../../utils/userPermissions.ts";

// Role select shape reused across every user fetch — includes the joined
// RolePermission rows so a flat `permissions` array can be derived per user.
const ROLE_SELECT_WITH_PERMISSIONS = {
  id: true,
  role: true,
  rolePermissions: {
    select: { module: true, permissions: true },
  },
} as const;

// Self-action guard — block any user (including super-admin) from
// performing destructive actions on their own account.
const assertNotSelf = (
  targetId: string,
  currentUserId: string | undefined,
  action: string,
) => {
  if (currentUserId && targetId === currentUserId) {
    throw new ApiError(
      status.FORBIDDEN,
      `You can't ${action} your own account`,
    );
  }
};

function normalizeCategoriesInput(raw: unknown): string[] {
  if (Array.isArray(raw))
    return raw
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  if (typeof raw === "string")
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

// create user

const createUserIntoDB = async (payload: any) => {
  const { user, profile, address, workInfo } = payload;

  const hashedPassword = await argon2.hash(user.password);

  const result = await prisma.$transaction(async (tc) => {
    // Create User
    const userData = {
      ...user,
      password: hashedPassword,
    };

    const newUser = await tc.user.create({
      data: userData,
    });

    // Create Profile
    if (profile) {
      const { dob, age, nidPhotoIds, nidPhotoUrls, ...profileRest } = profile;
      await tc.profile.create({
        data: {
          ...profileRest,
          dob: dob ? new Date(dob) : undefined,
          age: age ? Number(age) : undefined,
          mobile: user.mobile,
          nidPhoto: nidPhotoUrls || [],
          nidPhotos:
            nidPhotoIds && nidPhotoIds.length > 0
              ? {
                  connect: nidPhotoIds.map((id: string) => ({ id })),
                }
              : undefined,
        },
      });
    }

    // Create Address
    if (address) {
      await tc.address.create({
        data: {
          ...address,
          mobile: user.mobile,
        },
      });
    }

    // Create WorkInfo
    if (workInfo) {
      const { subCategoryIds, workTypeIds, ...workInfoRest } = workInfo;
      await tc.workInfo.create({
        data: {
          ...workInfoRest,
          mobile: user.mobile,
          subCategories:
            subCategoryIds && subCategoryIds.length > 0
              ? {
                  connect: subCategoryIds.map((id: string) => ({ id })),
                }
              : undefined,
          workTypes:
            workTypeIds && workTypeIds.length > 0
              ? {
                  connect: workTypeIds.map((id: string) => ({ id })),
                }
              : undefined,
        },
      });
    }

    return await tc.user.findUnique({
      where: { id: newUser.id },
      include: {
        role: {
          select: {
            id: true,
            role: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        profile: {
          include: {
            profilePhoto: {
              select: {
                id: true,
                url: true,
              },
            },
            nidPhotos: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
        address: true,
        workInfo: {
          include: {
            subCategories: {
              select: {
                id: true,
                name: true,
              },
            },
            workTypes: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  });

  if (result) {
    const { password, ...userWithoutPassword } = result as any;
    return userWithoutPassword;
  }

  return result;
};

// get all users
const getAllUsers = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.UserWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (query.searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map((text: string) => ({
        [text]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const booleanFields = ["isBlocked", "isDeleted", "isVerified", "isActive"];
  booleanFields.forEach((field) => {
    if (queryFilter[field]) {
      queryFilter[field] = queryFilter[field] === "true";
    }
  });

  // queryFilter
  if (Object.keys(queryFilter).length > 0) {
    andCondition.push({
      AND: Object.keys(queryFilter).map((key: string) => ({
        [key]: {
          equals: queryFilter[key as keyof typeof queryFilter],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput = {
    AND: andCondition,
  };

  const total = await prisma.user.count({
    where: whereCondition,
  });

  const users = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limitNumber,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    // skip: (Number(query.page) - 1) * Number(query.limit),
    // take: Number(query.limit),
    include: {
      role: {
        select: ROLE_SELECT_WITH_PERMISSIONS,
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      profile: {
        include: {
          profilePhoto: {
            select: {
              id: true,
              url: true,
            },
          },
          nidPhotos: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
      address: true,
      workInfo: {
        include: {
          subCategories: {
            select: {
              id: true,
              name: true,
            },
          },
          workTypes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    data: users.map(({ password, ...rest }) => ({
      ...rest,
      permissions: derivePermissionKeys(rest.role),
    })),
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
  };
};

// get user by id
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        select: ROLE_SELECT_WITH_PERMISSIONS,
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      profile: {
        include: {
          profilePhoto: {
            select: {
              id: true,
              url: true,
            },
          },
          nidPhotos: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
      address: true,
      workInfo: {
        include: {
          subCategories: {
            select: {
              id: true,
              name: true,
            },
          },
          workTypes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  if (!user) return user;
  const { password, ...rest } = user;
  return {
    ...rest,
    password: undefined,
    permissions: derivePermissionKeys(rest.role),
  };
};

// get all users

// update user
const updateUser = async (
  id: string,
  payload: any,
  currentUserId?: string,
) => {
  const { user, profile, address, workInfo } = payload;
  const { password, role, ...rest } = user || {};

  // Self-protection: a user cannot change their own role / roleId.
  // Other field edits (profile, address, etc.) are fine — only the role
  // assignment is locked so you can't escalate or demote yourself.
  const roleIdInPayload = rest?.roleId ?? payload?.roleId;
  const wantsRoleChange =
    role !== undefined || roleIdInPayload !== undefined;
  if (wantsRoleChange) {
    assertNotSelf(id, currentUserId, "change the role of");
  }

  const updateData: Record<string, unknown> = {};
  const userScalarKeys = [
    "email",
    "mobile",
    "isActive",
    "isBlocked",
    "isDeleted",
    "isVerified",
    "departmentId",
    "subscriptionId",
  ] as const;
  for (const k of userScalarKeys) {
    if (rest[k] !== undefined) updateData[k] = rest[k];
  }
  if (rest.createdAt) updateData.createdAt = new Date(rest.createdAt);
  if (rest.updatedAt) updateData.updatedAt = new Date(rest.updatedAt);

  // Handle case where fields might be directly in payload instead of user object
  if (!user) {
    for (const k of userScalarKeys) {
      if (payload[k] !== undefined) updateData[k] = payload[k];
    }
  }

  if (password) {
    updateData.password = await argon2.hash(password);
    updateData.passwordChanged = true;
    updateData.passwordChangeTime = new Date();
  }

  if (role) {
    const r = await prisma.allRole.findFirst({
      where: { role: String(role) },
    });
    if (r) updateData.roleId = r.id;
  }

  // Prepare workInfo update
  let workInfoUpdate = undefined;
  if (workInfo) {
    const { subCategoryIds, workTypeIds, ...workInfoRest } = workInfo;
    workInfoUpdate = {
      update: {
        ...workInfoRest,
        subCategories:
          subCategoryIds && subCategoryIds.length > 0
            ? {
                set: subCategoryIds.map((id: string) => ({ id })),
              }
            : undefined,
        workTypes: workTypeIds
          ? {
              set: workTypeIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
    };
  }

  // Prepare profile update
  let profileUpdate = undefined;
  if (profile) {
    const { dob, age, nidPhotoIds, nidPhotoUrls, ...profileRest } = profile;
    profileUpdate = {
      update: {
        ...profileRest,
        dob: dob ? new Date(dob) : undefined,
        age: age ? Number(age) : undefined,
        nidPhoto: nidPhotoUrls || [],
        nidPhotos:
          nidPhotoIds && nidPhotoIds.length > 0
            ? {
                set: nidPhotoIds.map((id: string) => ({ id })),
              }
            : undefined,
      },
    };
  }

  const finalUpdateData: any = {
    ...updateData,
    profile: profileUpdate,
    address: address
      ? {
          update: address,
        }
      : undefined,
    workInfo: workInfoUpdate,
  };

  // Remove undefined keys to satisfy exactOptionalPropertyTypes: true
  Object.keys(finalUpdateData).forEach(
    (key) => finalUpdateData[key] === undefined && delete finalUpdateData[key],
  );

  const result = await prisma.user.update({
    where: { id },
    data: finalUpdateData,
    include: {
      role: {
        select: ROLE_SELECT_WITH_PERMISSIONS,
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      profile: {
        include: {
          profilePhoto: {
            select: {
              id: true,
              url: true,
            },
          },
          nidPhotos: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
      address: true,
      workInfo: {
        include: {
          subCategories: {
            select: {
              id: true,
              name: true,
            },
          },
          workTypes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return result;
};

// get my data

const getMyData = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      role: {
        select: ROLE_SELECT_WITH_PERMISSIONS,
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      profile: {
        include: {
          profilePhoto: {
            select: {
              id: true,
              url: true,
            },
          },
          nidPhotos: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
      address: true,
      workInfo: {
        include: {
          subCategories: {
            select: {
              id: true,
              name: true,
            },
          },
          workTypes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  const { password, ...rest } = user;
  return {
    ...rest,
    password: undefined,
    permissions: derivePermissionKeys(rest.role),
  };
};

// change password
const changePassword = async (
  payload: { oldPassword: string; newPassword: string },
  id: string,
) => {
  console.log(payload, id);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      role: true,
      profile: {
        include: {
          profilePhoto: true,
        },
      },
      workInfo: {
        include: {
          subCategories: true,
          workTypes: true,
        },
      },
      department: true,
      address: true,
    },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  if (payload.oldPassword === payload.newPassword) {
    throw new ApiError(
      status.BAD_REQUEST,
      "🔍❓ Old Password and New Password cannot be the same",
    );
  }

  const isPasswordCorrect = await argon2.verify(
    user.password,
    payload.oldPassword,
  );
  if (!isPasswordCorrect) {
    throw new ApiError(status.UNAUTHORIZED, "🔍❓ Old Password is incorrect");
  }

  const hashedPassword = await argon2.hash(payload.newPassword);
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
      passwordChanged: true,
      passwordChangeTime: new Date(),
    },
    include: {
      role: true,
      profile: {
        include: {
          profilePhoto: true,
        },
      },
      workInfo: {
        include: {
          subCategories: true,
          workTypes: true,
        },
      },
      department: true,
      address: true,
    },
  });

  const payloadData = {
    id: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role?.role,
    mobile: updatedUser.mobile,
    isBlocked: updatedUser.isBlocked,
    isDeleted: updatedUser.isDeleted,
    isVerified: updatedUser.isVerified,
    isActive: updatedUser.isActive,
    passwordChanged: updatedUser.passwordChanged,
    passwordChangeTime: updatedUser.passwordChangeTime,
    lastLogin: updatedUser.lastLogin,
  };

  const accessToken = JwtHelpers.generateToken(
    payloadData,
    config.accessSecret as string,
    config.accessExpire as string,
  );
  const refreshToken = JwtHelpers.generateToken(
    payloadData,
    config.refreshSecret as string,
    config.refreshExpire as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      name: updatedUser.profile?.name,
      photo: updatedUser.profile?.profilePhoto?.url,
      role: updatedUser.role?.role,
      gender: updatedUser.profile?.gender,
      bloodGroup: updatedUser.profile?.bloodGroup,
      age: updatedUser.profile?.age,
      designation: updatedUser.workInfo?.experience,
      department: updatedUser.department?.name,
      address: updatedUser.address,
      workInfo: {
        ...updatedUser.workInfo,
        subCategories: updatedUser.workInfo?.subCategories?.map((s) => s.name),
        workTypes: updatedUser.workInfo?.workTypes?.map((w) => w.name),
      },
      isActive: updatedUser.isActive,
      isVerified: updatedUser.isVerified,
      isBlocked: updatedUser.isBlocked,
      isDeleted: updatedUser.isDeleted,
    },
    isLogin: true,
  };
};

const varifyOtp = async (email: string, otp: string) => {
  console.log("otpData", otp);

  const otpData = await prisma.otp.findUniqueOrThrow({
    where: { email: email },
  });
  if (!otpData) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ OTP not Found");
  }

  if (otpData.otpToken !== otp) {
    throw new ApiError(status.BAD_REQUEST, "🔍❓ OTP is incorrect");
  }

  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: { isVerified: true },
  });
  return updatedUser;
};

const deleteUser = async (id: string, currentUserId?: string) => {
  assertNotSelf(id, currentUserId, "delete");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  // Delete related records using mobile (since they relate via mobile field)
  await prisma.otp.deleteMany({
    where: { email: user.email },
  });
  await prisma.profile.deleteMany({
    where: { mobile: user.mobile },
  });
  await prisma.address.deleteMany({
    where: { mobile: user.mobile },
  });
  await prisma.workInfo.deleteMany({
    where: { mobile: user.mobile },
  });

  // Finally delete the user by id
  const deletedUser = await prisma.user.delete({
    where: { id },
  });
  return [];
};

const softDeleteUser = async (id: string, currentUserId?: string) => {
  assertNotSelf(id, currentUserId, "delete");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const deletedUser = await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });
  return deletedUser;
};

const blockUser = async (id: string, currentUserId?: string) => {
  assertNotSelf(id, currentUserId, "block");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const deletedUser = await prisma.user.update({
    where: { id },
    data: { isBlocked: !user.isBlocked },
  });
  return deletedUser;
};

export const UserServices = {
  createUserIntoDB,
  getUserById,
  getAllUsers,
  updateUser,
  getMyData,
  changePassword,
  varifyOtp,
  deleteUser,
  softDeleteUser,
  blockUser,
};
