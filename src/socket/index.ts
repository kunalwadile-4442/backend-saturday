import type { Server as SocketServer, Socket } from "socket.io"
import { verifyAccessToken, verifyGuestToken } from "../utils/jwt.util"
import { UserRole } from "../types"
import { MESSAGES } from "../constants/messages"
import { hasPermission, PERMISSIONS } from "../utils/permission.util"

interface AuthenticatedSocket extends Socket {
  userId?: string
  userRole?: UserRole
}

export const setupSocketIO = (io: SocketServer): void => {
  // Socket.IO Authentication Middleware
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.cookie?.split("accessToken=")[1]?.split(";")[0]

      if (!token) {
        return next(new Error(MESSAGES.ERROR.TOKEN_REQUIRED))
      }

      try {
        // Try access token first
        const decoded = verifyAccessToken(token)
        socket.userId = decoded.userId
        socket.userRole = decoded.role
      } catch {
        // If access token fails, try guest token
        const decoded = verifyGuestToken(token)
        socket.userRole = UserRole.GUEST
      }

      next()
    } catch (error) {
      next(new Error(MESSAGES.ERROR.SOCKET_AUTH_FAILED))
    }
  })

  // Socket.IO Connection Handler
  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`✅ Socket connected: ${socket.id} | Role: ${socket.userRole}`)

    // Join user to their personal room (for authenticated users)
    if (socket.userId) {
      socket.join(`user:${socket.userId}`)
    }

    // PUBLIC EVENT - Anyone can access
    socket.on("public:message", (data) => {
      console.log("Public message received:", data)
      io.emit("public:message:response", {
        success: true,
        message: "Public message received",
        data,
        timestamp: new Date(),
      })
    })

    // GUEST EVENT - Guest and authenticated users can access
    socket.on("guest:ping", (data) => {
      if (!hasPermission(socket.userRole!, PERMISSIONS.GUEST)) {
        socket.emit("error", {
          success: false,
          message: MESSAGES.ERROR.FORBIDDEN,
        })
        return
      }

      socket.emit("guest:pong", {
        success: true,
        message: "Pong from server",
        data,
        timestamp: new Date(),
      })
    })

    // PRIVATE EVENT - Only authenticated users
    socket.on("private:message", (data) => {
      if (!socket.userId || !hasPermission(socket.userRole!, PERMISSIONS.USER)) {
        socket.emit("error", {
          success: false,
          message: MESSAGES.ERROR.UNAUTHORIZED,
        })
        return
      }

      console.log(`Private message from user ${socket.userId}:`, data)

      // Send to user's personal room
      io.to(`user:${socket.userId}`).emit("private:message:response", {
        success: true,
        message: "Private message received",
        data,
        userId: socket.userId,
        timestamp: new Date(),
      })
    })

    // ADMIN EVENT - Only admin users
    socket.on("admin:broadcast", (data) => {
      if (!hasPermission(socket.userRole!, PERMISSIONS.ADMIN)) {
        socket.emit("error", {
          success: false,
          message: MESSAGES.ERROR.FORBIDDEN,
        })
        return
      }

      console.log("Admin broadcast:", data)
      io.emit("admin:announcement", {
        success: true,
        message: data.message,
        from: "Admin",
        timestamp: new Date(),
      })
    })

    // ROLE-BASED ROOM JOIN
    socket.on("join:room", (roomName: string) => {
      if (!socket.userId) {
        socket.emit("error", {
          success: false,
          message: MESSAGES.ERROR.UNAUTHORIZED,
        })
        return
      }

      socket.join(roomName)
      socket.emit("room:joined", {
        success: true,
        room: roomName,
        message: `Joined room: ${roomName}`,
      })
    })

    // Disconnect Handler
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`)
    })
  })

  console.log("✅ Socket.IO setup complete")
}
