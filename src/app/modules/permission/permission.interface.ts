export interface IRolePermission {
  id: string;
  roleId?: string | null;
  module?: string | null;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type IPermissionFilterRequest = {
  searchTerm?: string;
  roleId?: string;
  module?: string;
};
