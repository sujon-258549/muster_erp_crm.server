export const USER_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MAINTAINER: "MAINTAINER",
  OWNER: "OWNER",
  USER: "USER",
  WORKER: "WORKER",
  EMPLOYEE: "EMPLOYEE",
} as const;
export const ALL_ROLES = Object.values(USER_ROLE);

export const userSearchableFields = ["email", "mobile"];

export const userFilterableFields = [
  "email",
  "mobile",
  "searchTerm",
  "role",
  "isBlocked",
  "isDeleted",
  "isVerified",
  "isActive",
  "createdAt",
  "updatedAt",
  "page",
  "limit",
  "sortBy",
  "sortOrder",
];
