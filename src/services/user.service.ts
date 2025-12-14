import User from "../models/user.model"
import { MESSAGES } from "../constants/messages"
import { createPaginationResult } from "../utils/pagination.util"

class UserService {
  async getAllUsers(paginationParams: any, search?: string) {
    const { page, limit, skip, sort } = paginationParams

    const query: any = {}
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const [users, total] = await Promise.all([
      User.find(query).sort(sort).skip(skip).limit(limit).select("-password"),
      User.countDocuments(query),
    ])

    return createPaginationResult(users, total, page, limit)
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).select("-password")
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
    }
    return user
  }

  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
    }
    return user
  }
}

export const userService = new UserService()
