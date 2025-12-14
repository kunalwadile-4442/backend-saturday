import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../types"
import { type Permission, hasPermission } from "../utils/permission.util"
import { sendError } from "../utils/response.util"
import { MESSAGES } from "../constants/messages"

export const requirePermission = (...permissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      sendError(res, MESSAGES.ERROR.UNAUTHORIZED, 401)
      return
    }

    const hasRequiredPermission = permissions.some((permission) => hasPermission(req.userRole!, permission))

    if (!hasRequiredPermission) {
      sendError(res, MESSAGES.ERROR.FORBIDDEN, 403)
      return
    }

    next()
  }
}
