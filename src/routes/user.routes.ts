import { Router } from "express"
import userController from "../controllers/user.controller"
import { authenticate } from "../middleware/auth.middleware"
import { requirePermission } from "../middleware/permission.middleware"
import { PERMISSIONS } from "../utils/permission.util"
import { cacheMiddleware } from "../middleware/cache.middleware"

const router = Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users with pagination
 */
router.get(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.ADMIN),
  cacheMiddleware(300), // Cache for 5 minutes
  userController.getAllUsers,
)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (User or Admin)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/:id", authenticate, requirePermission(PERMISSIONS.USER), userController.getUserById)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/:id", authenticate, requirePermission(PERMISSIONS.ADMIN), userController.deleteUser)

export default router
