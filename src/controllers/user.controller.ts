import type { Response } from "express"
import type { AuthRequest } from "../types"
import { userService } from "../services/user.service"
import { sendSuccess, sendError } from "../utils/response.util"
import { MESSAGES } from "../constants/messages"
import { getPaginationParams } from "../utils/pagination.util"

class UserController {
  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const paginationParams = getPaginationParams(req.query)
      const result = await userService.getAllUsers(paginationParams, req.query.search as string)

      sendSuccess(res, MESSAGES.SUCCESS.DATA_FETCHED, result)
    } catch (error: any) {
      sendError(res, error.message, 500)
    }
  }

  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id)
      sendSuccess(res, MESSAGES.SUCCESS.DATA_FETCHED, { user })
    } catch (error: any) {
      sendError(res, error.message, 404)
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      await userService.deleteUser(req.params.id)
      sendSuccess(res, MESSAGES.SUCCESS.DATA_DELETED)
    } catch (error: any) {
      sendError(res, error.message, 500)
    }
  }
}

export default new UserController()
