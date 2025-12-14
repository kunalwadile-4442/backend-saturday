import User from "../../models/user.model"
import type { SocketResponse } from "../../types/socket.types"
import { SocketResponseUtil } from "../../utils/socket-response.util"

export class UserSocketService {
  static async list(payload: any, request: any): Promise<SocketResponse> {
    try {
      const { query = "", limit = 10, page = 1 } = payload

      const pageNum = Number.parseInt(page as string)
      const limitNum = Number.parseInt(limit as string)
      const skip = (pageNum - 1) * limitNum

      // Build search query
      const searchQuery: any = {}

      if (query) {
        searchQuery.$or = [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }]
      }

      // Get users and total count
      const [users, totalCount] = await Promise.all([
        User.find(searchQuery).select("-password").skip(skip).limit(limitNum).lean(),
        User.countDocuments(searchQuery),
      ])

      const responseData = {
        items: users,
        totalCount,
        paginationData: {
          total_records: totalCount,
          record_limit: limitNum,
          current_page: pageNum,
        },
      }

      return SocketResponseUtil.success("users_found", responseData, request)
    } catch (error) {
      return SocketResponseUtil.error(
        "failed_to_fetch_users",
        [error instanceof Error ? error.message : "Unknown error"],
        request,
      )
    }
  }

  static async update(payload: any, request: any): Promise<SocketResponse> {
    try {
      const { id, ...updateData } = payload

      if (!id) {
        return SocketResponseUtil.validationError(["User ID is required"], request)
      }

      // Remove password from update data if present
      delete updateData.password

      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password")

      if (!user) {
        return SocketResponseUtil.error("user_not_found", ["User not found"], request)
      }

      return SocketResponseUtil.success("User details updated successfully", user, request)
    } catch (error) {
      return SocketResponseUtil.error(
        "failed_to_update_user",
        [error instanceof Error ? error.message : "Unknown error"],
        request,
      )
    }
  }

  static async getById(payload: any, request: any): Promise<SocketResponse> {
    try {
      const { id } = payload

      if (!id) {
        return SocketResponseUtil.validationError(["User ID is required"], request)
      }

      const user = await User.findById(id).select("-password")

      if (!user) {
        return SocketResponseUtil.error("user_not_found", ["User not found"], request)
      }

      return SocketResponseUtil.success("user_found", user, request)
    } catch (error) {
      return SocketResponseUtil.error(
        "failed_to_fetch_user",
        [error instanceof Error ? error.message : "Unknown error"],
        request,
      )
    }
  }
}
