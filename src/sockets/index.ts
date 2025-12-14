// import type { Server as HTTPServer } from "http"
// import { Server, type Socket } from "socket.io"
// import jwt from "jsonwebtoken"
// import type { TokenPayload } from "../types"
// import type { SocketRequest } from "../types/socket.types"
// import { SocketRouter } from "./socket-router"
// import { MESSAGES } from "../constants/messages"

// export class SocketService {
//   private io: Server

//   constructor(httpServer: HTTPServer) {
//     this.io = new Server(httpServer, {
//       cors: {
//         origin: process.env.CORS_ORIGIN || "*",
//         credentials: true,
//       },
//     })

//     this.setupMiddleware()
//     this.setupConnectionHandler()
//   }

//   private setupMiddleware() {
//     // Authentication middleware
//     this.io.use((socket: Socket, next) => {
//       const token = socket.handshake.auth.token || socket.handshake.headers.authorization

//       if (!token) {
//         return next(new Error(MESSAGES.AUTH.UNAUTHORIZED))
//       }

//       try {
//         const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET!) as TokenPayload

//         // Attach user data to socket
//         socket.data.user = decoded
//         next()
//       } catch (error) {
//         next(new Error(MESSAGES.AUTH.INVALID_TOKEN))
//       }
//     })
//   }

//   private setupConnectionHandler() {
//     this.io.on("connection", (socket: Socket) => {
//       console.log(`[v0] Socket connected: ${socket.id}`)
//       console.log(`[v0] User: ${socket.data.user?.email || "Unknown"}`)

//       // Handle type-action based requests
//       socket.on("request", async (data: SocketRequest, callback) => {
//         console.log(`[v0] Socket request received:`, {
//           type: data.type,
//           action: data.action,
//           socketId: socket.id,
//         })

//         const response = await SocketRouter.handleRequest(socket, data)

//         // Send response via callback if provided, otherwise emit
//         if (callback && typeof callback === "function") {
//           callback(response)
//         } else {
//           socket.emit("response", response)
//         }
//       })

//       // Broadcast to all connected clients (admin only)
//       socket.on("broadcast", async (data: any) => {
//         if (socket.data.user?.role === "admin") {
//           this.io.emit("broadcast", data)
//         }
//       })

//       // Join room (for private channels)
//       socket.on("join_room", (roomId: string) => {
//         socket.join(roomId)
//         console.log(`[v0] Socket ${socket.id} joined room: ${roomId}`)
//       })

//       // Leave room
//       socket.on("leave_room", (roomId: string) => {
//         socket.leave(roomId)
//         console.log(`[v0] Socket ${socket.id} left room: ${roomId}`)
//       })

//       socket.on("disconnect", () => {
//         console.log(`[v0] Socket disconnected: ${socket.id}`)
//       })
//     })
//   }

//   public getIO(): Server {
//     return this.io
//   }

//   // Helper method to emit to specific room
//   public emitToRoom(roomId: string, event: string, data: any) {
//     this.io.to(roomId).emit(event, data)
//   }

//   // Helper method to emit to specific user
//   public emitToUser(userId: string, event: string, data: any) {
//     this.io.to(userId).emit(event, data)
//   }
// }
import type { Server as HTTPServer } from "http"
import { Server, type Socket } from "socket.io"
import jwt from "jsonwebtoken"
import type { TokenPayload } from "../types"
import type { SocketRequest } from "../types/socket.types"
import { SocketRouter } from "./socket-router"
import { MESSAGES } from "../constants/messages"

export class SocketService {
  private io: Server

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
      },
    })

    this.setupMiddleware()
    this.setupConnectionHandler()
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket: Socket, next) => {
      // Try to get token from multiple sources
      let token = socket.handshake.auth.token || socket.handshake.headers.authorization

      // If no token in auth or headers, try to extract from cookies
      if (!token) {
        const cookies = socket.handshake.headers.cookie
        if (cookies) {
          const accessTokenMatch = cookies.match(/accessToken=([^;]+)/)
          if (accessTokenMatch) {
            token = accessTokenMatch[1]
          }
        }
      }

      if (!token) {
        return next(new Error(MESSAGES.AUTH.UNAUTHORIZED))
      }

      try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET!) as TokenPayload

        // Attach user data to socket
        socket.data.user = decoded
        next()
      } catch (error) {
        next(new Error(MESSAGES.AUTH.INVALID_TOKEN))
      }
    })
  }

  private setupConnectionHandler() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`[v0] Socket connected: ${socket.id}`)
      console.log(`[v0] User: ${socket.data.user?.email || "Unknown"}`)

      // Handle type-action based requests
      socket.on("request", async (data: SocketRequest, callback) => {
        console.log(`[v0] Socket request received:`, {
          type: data.type,
          action: data.action,
          socketId: socket.id,
        })

        const response = await SocketRouter.handleRequest(socket, data)

        // Send response via callback if provided, otherwise emit
        if (callback && typeof callback === "function") {
          callback(response)
        } else {
          socket.emit("response", response)
        }
      })

      // Broadcast to all connected clients (admin only)
      socket.on("broadcast", async (data: any) => {
        if (socket.data.user?.role === "admin") {
          this.io.emit("broadcast", data)
        }
      })

      // Join room (for private channels)
      socket.on("join_room", (roomId: string) => {
        socket.join(roomId)
        console.log(`[v0] Socket ${socket.id} joined room: ${roomId}`)
      })

      // Leave room
      socket.on("leave_room", (roomId: string) => {
        socket.leave(roomId)
        console.log(`[v0] Socket ${socket.id} left room: ${roomId}`)
      })

      socket.on("disconnect", () => {
        console.log(`[v0] Socket disconnected: ${socket.id}`)
      })
    })
  }

  public getIO(): Server {
    return this.io
  }

  // Helper method to emit to specific room
  public emitToRoom(roomId: string, event: string, data: any) {
    this.io.to(roomId).emit(event, data)
  }

  // Helper method to emit to specific user
  public emitToUser(userId: string, event: string, data: any) {
    this.io.to(userId).emit(event, data)
  }
}
