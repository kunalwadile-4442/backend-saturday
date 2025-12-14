// import express, { type Application } from "express"
// import http from "http"
// import dotenv from "dotenv"
// import cookieParser from "cookie-parser"
// import cors from "cors"
// import helmet from "helmet"
// import compression from "compression"
// import { connectDatabase } from "./config/database"
// import { connectRedis } from "./config/redis"
// import { setupSwagger } from "./config/swagger"
// import { errorHandler } from "./middleware/error-handler"
// import { SocketService } from "./sockets"
// import routes from "./routes"

// dotenv.config()

// const app: Application = express()
// const server = http.createServer(app)

// // Middleware
// app.use(helmet())
// app.use(compression())
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || "http://localhost:3000",
//     credentials: true,
//   }),
// )
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser())

// // Swagger Documentation
// setupSwagger(app)

// // Routes
// app.use("/api", routes)

// // Error Handler (must be last)
// app.use(errorHandler)

// const PORT = process.env.PORT || 8000

// const startServer = async () => {
//   try {
//     // Connect to MongoDB
//     await connectDatabase()

//     // Connect to Redis
//     await connectRedis()

//     const socketService = new SocketService(server)

//     server.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`)
//       console.log(`📚 Swagger documentation: http://localhost:${PORT}/api-docs`)
//       console.log(`🔌 Socket.IO server running with type-action system`)
//     })
//   } catch (error) {
//     console.error("Failed to start server:", error)
//     process.exit(1)
//   }
// }

// startServer()

// export { app }
import express, { type Application } from "express"
import http from "http"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import { connectDatabase } from "./config/database"
import { connectRedis } from "./config/redis"
import { setupSwagger } from "./config/swagger"
import { errorHandler } from "./middleware/error-handler"
import { SocketService } from "./sockets"
import routes from "./routes"

dotenv.config()

const app: Application = express()
const server = http.createServer(app)

// Middleware
app.use(helmet())
app.use(compression())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(express.static("public"))

// Swagger Documentation
setupSwagger(app)

// Routes
app.use("/api", routes)

// Error Handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase()

    // Connect to Redis
    await connectRedis()

    const socketService = new SocketService(server)

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📚 Swagger documentation: http://localhost:${PORT}/api-docs`)
      console.log(`🔌 Socket.IO server running with type-action system`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

export { app }

