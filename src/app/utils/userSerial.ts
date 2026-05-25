import { Role } from "../../generated/prisma/client.js";
import prisma from "./prismaClient.js";

const getRolePrefix = (role: Role) => {
  switch (role) {
    case Role.SUPER_ADMIN:
      return "SA-";
    case Role.ADMIN:
      return "A-";
    case Role.MAINTAINER:
      return "M-";
    case Role.OWNER:
      return "O-";
    case Role.WORKER:
      return "W-";
    case Role.EMPLOYEE:
      return "E-";
    case Role.USER:
    default:
      return "U-";
  }
};

const findLastUserSerialId = async (role: Role) => {
  const prefix = getRolePrefix(role);

  const lastUser = await prisma.user.findFirst({
    where: {
      role: {
        role: role,
      },
      id: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return lastUser?.id;
};

export const userSerialId = async (user: any) => {
  let currentId = (0).toString();
  const lastUserId = await findLastUserSerialId(user.role);

  if (lastUserId) {
    currentId = lastUserId.split("-")[1] || (0).toString();
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(5, "0");
  const prefix = getRolePrefix(user.role);

  return `${prefix}${incrementId}`;
};
