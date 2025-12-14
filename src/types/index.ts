import type { Request } from "express"
import type { JwtPayload } from "jsonwebtoken"

export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  role: UserRole
  is_online: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

export interface AuthRequest extends Request {
  user?: IUser
  userId?: string
  userRole?: UserRole
}

export interface TokenPayload extends JwtPayload {
  userId: string
  email: string
  role: UserRole
}

export interface PaginationQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  search?: string
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}
