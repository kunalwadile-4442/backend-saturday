import { Router } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" })
})

export default router