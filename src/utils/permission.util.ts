import { UserRole } from "../types"

export const PERMISSIONS = {
  PUBLIC: "public",
  GUEST: "guest",
  USER: "user",
  ADMIN: "admin",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const roleHierarchy: Record<UserRole, number> = {
  [UserRole.GUEST]: 1,
  [UserRole.USER]: 2,
  [UserRole.ADMIN]: 3,
}

export const hasPermission = (userRole: UserRole, requiredPermission: Permission): boolean => {
  // Public permission allows everyone
  if (requiredPermission === PERMISSIONS.PUBLIC) {
    return true
  }

  // Guest permission allows guest and above
  if (requiredPermission === PERMISSIONS.GUEST) {
    return roleHierarchy[userRole] >= roleHierarchy[UserRole.GUEST]
  }

  // User permission requires user or admin
  if (requiredPermission === PERMISSIONS.USER) {
    return roleHierarchy[userRole] >= roleHierarchy[UserRole.USER]
  }

  // Admin permission requires admin
  if (requiredPermission === PERMISSIONS.ADMIN) {
    return userRole === UserRole.ADMIN
  }

  return false
}

export const checkMultiplePermissions = (userRole: UserRole, permissions: Permission[]): boolean => {
  return permissions.some((permission) => hasPermission(userRole, permission))
}
