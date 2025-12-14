import type { Request, Response, NextFunction } from "express"
import { MESSAGES } from "../constants/messages"

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err)

  const statusCode = err.statusCode || 500
  const message = err.message || MESSAGES.ERROR.INTERNAL_SERVER

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  })
}
