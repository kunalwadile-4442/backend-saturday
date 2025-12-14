import User from "../models/user.model"
import { UserRole } from "../types"
import { generateAccessToken, generateRefreshToken, generateGuestToken } from "../utils/jwt.util"
import { MESSAGES } from "../constants/messages"

class AuthService {
  async register(name: string, email: string, password: string, role?: UserRole) {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.USER_EXISTS)
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || UserRole.USER,
    })

    const accessToken = generateAccessToken(user._id.toString(), user.email, user.role)
    const refreshToken = generateRefreshToken(user._id.toString())

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS)
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS)
    }

    if (!user.isActive) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
    }

    const accessToken = generateAccessToken(user._id.toString(), user.email, user.role)
    const refreshToken = generateRefreshToken(user._id.toString())

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async generateGuestToken() {
    return generateGuestToken()
  }

  async getUserProfile(userId: string) {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }
  }
}

export const authService = new AuthService()
