import type { Response } from "express"
import type { AuthRequest } from "../types"
import { authService } from "../services/auth.service"
import { sendSuccess, sendError } from "../utils/response.util"
import { MESSAGES } from "../constants/messages"

class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body

      const result = await authService.register(name, email, password)

      // Set cookies
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: "strict",
      })

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "strict",
      })

      sendSuccess(
        res,
        MESSAGES.SUCCESS.REGISTER,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        201,
      )
    } catch (error: any) {
      sendError(res, error.message, 400)
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      const result = await authService.login(email, password)

      // Set cookies
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict",
      })

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })

      sendSuccess(res, MESSAGES.SUCCESS.LOGIN, {
        user: result.user,
        accessToken: result.accessToken,
      })
    } catch (error: any) {
      sendError(res, error.message, 401)
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.clearCookie("guestToken")

    sendSuccess(res, MESSAGES.SUCCESS.LOGOUT)
  }

  async generateGuestToken(req: AuthRequest, res: Response): Promise<void> {
    try {
      const guestToken = await authService.generateGuestToken()

      res.cookie("guestToken", guestToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000, // 1 hour
        sameSite: "strict",
      })

      sendSuccess(res, MESSAGES.SUCCESS.GUEST_TOKEN, { guestToken })
    } catch (error: any) {
      sendError(res, error.message, 500)
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getUserProfile(req.userId!)
      sendSuccess(res, MESSAGES.SUCCESS.DATA_FETCHED, { user })
    } catch (error: any) {
      sendError(res, error.message, 404)
    }
  }
}

export default new AuthController()
