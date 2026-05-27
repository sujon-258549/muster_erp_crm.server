// Shape we expect when a user is fetched with role.rolePermissions included.
// Loose typing — the same helper works for any Prisma query that pulls these
// fields, regardless of which other relations the query selects.
interface RoleWithPermissions {
  rolePermissions?: { module?: string | null; permissions?: string[] }[] | null
}

export interface PermissionRow {
  module: string
  actions: string[]
}

// Flat list of module keys the role grants any action on. Returned to the
// frontend as `user.permissions` and consumed by:
//   - sidebar visibility
//   - <RequirePermission /> route guard
//   - useHasPermission() checks
// Action-level checks remain server-side via requirePermission(module, action).
export const derivePermissionKeys = (
  role: RoleWithPermissions | null | undefined,
): string[] => {
  if (!role?.rolePermissions) return []
  const keys: string[] = []
  for (const row of role.rolePermissions) {
    if (row.module && (row.permissions?.length ?? 0) > 0) {
      keys.push(row.module)
    }
  }
  return keys
}

// Structured rows — module key + the action list granted on it. Returned
// to the frontend as `user.permissionRows` so action-level UI checks
// (e.g. hide a Delete button when only `read` is granted) can be done
// without re-fetching from /permission/role/:id.
export const derivePermissionRows = (
  role: RoleWithPermissions | null | undefined,
): PermissionRow[] => {
  if (!role?.rolePermissions) return []
  const rows: PermissionRow[] = []
  for (const row of role.rolePermissions) {
    if (row.module && (row.permissions?.length ?? 0) > 0) {
      rows.push({ module: row.module, actions: row.permissions ?? [] })
    }
  }
  return rows
}
