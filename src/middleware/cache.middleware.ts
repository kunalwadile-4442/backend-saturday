import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../types"
import { getCache, setCache } from "../config/redis"

export const cacheMiddleware = (expiry = 3600) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const key = `cache:${req.originalUrl}:${req.userId || "public"}`

    try {
      const cachedData = await getCache(key)

      if (cachedData) {
        res.status(200).json(cachedData)
        return
      }

      // Store original json method
      const originalJson = res.json.bind(res)

      // Override json method to cache response
      res.json = (body: any) => {
        setCache(key, body, expiry).catch(console.error)
        return originalJson(body)
      }

      next()
    } catch (error) {
      console.error("Cache middleware error:", error)
      next()
    }
  }
}
