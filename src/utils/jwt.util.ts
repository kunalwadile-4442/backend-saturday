import jwt from "jsonwebtoken"
import { type TokenPayload, UserRole } from "../types"

export const generateAccessToken = (userId: string, email: string, role: UserRole): string => {
  return jwt.sign({ userId, email, role }, process.env.JWT_ACCESS_SECRET || "access-secret", {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
  })
}

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || "refresh-secret", {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
  })
}

export const generateGuestToken = (): string => {
  return jwt.sign({ role: UserRole.GUEST }, process.env.JWT_GUEST_SECRET || "guest-secret", {
    expiresIn: process.env.JWT_GUEST_EXPIRY || "1h",
  })
}

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || "access-secret") as TokenPayload
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || "refresh-secret") as TokenPayload
}

export const verifyGuestToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_GUEST_SECRET || "guest-secret") as TokenPayload
}
