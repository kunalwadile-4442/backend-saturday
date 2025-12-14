import type { Response, NextFunction } from "express"
import { type AuthRequest, UserRole } from "../types"
import { verifyAccessToken, verifyGuestToken } from "../utils/jwt.util"
import { sendError } from "../utils/response.util"
import { MESSAGES } from "../constants/messages"
import User from "../models/user.model"

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check for token in cookies first, then Authorization header
    let token = req.cookies.accessToken

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      sendError(res, MESSAGES.ERROR.TOKEN_REQUIRED, 401)
      return
    }

    const decoded = verifyAccessToken(token)

    // Attach user info to request
    req.userId = decoded.userId
    req.userRole = decoded.role

    // Optionally fetch full user object
    const user = await User.findById(decoded.userId)
    if (!user || !user.isActive) {
      sendError(res, MESSAGES.ERROR.USER_NOT_FOUND, 401)
      return
    }

    req.user = user
    next()
  } catch (error) {
    sendError(res, MESSAGES.ERROR.INVALID_TOKEN, 401)
  }
}

export const authenticateGuest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies.guestToken || req.cookies.accessToken

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      sendError(res, MESSAGES.ERROR.TOKEN_REQUIRED, 401)
      return
    }

    try {
      // Try guest token first
      const decoded = verifyGuestToken(token)
      req.userRole = UserRole.GUEST
    } catch {
      // If guest token fails, try access token
      const decoded = verifyAccessToken(token)
      req.userId = decoded.userId
      req.userRole = decoded.role
    }

    next()
  } catch (error) {
    sendError(res, MESSAGES.ERROR.INVALID_TOKEN, 401)
  }
}

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies.accessToken

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (token) {
      try {
        const decoded = verifyAccessToken(token)
        req.userId = decoded.userId
        req.userRole = decoded.role
      } catch {
        // Invalid token, but continue as public access
      }
    }

    next()
  } catch (error) {
    next()
  }
}
