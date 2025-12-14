import { createClient, type RedisClientType } from "redis"

let redisClient: RedisClientType

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number.parseInt(process.env.REDIS_PORT || "6379"),
      },
      password: process.env.REDIS_PASSWORD || undefined,
    })

    redisClient.on("error", (err) => console.error("Redis Client Error", err))
    redisClient.on("connect", () => console.log("✅ Redis connected successfully"))

    await redisClient.connect()
  } catch (error) {
    console.error("❌ Redis connection error:", error)
    // Don't throw error, allow app to run without Redis
    console.warn("⚠️  Application will run without Redis caching")
  }
}

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error("Redis client not initialized")
  }
  return redisClient
}

export const setCache = async (key: string, value: any, expiry = 3600): Promise<void> => {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(key, expiry, JSON.stringify(value))
    }
  } catch (error) {
    console.error("Redis set error:", error)
  }
}

export const getCache = async (key: string): Promise<any> => {
  try {
    if (redisClient && redisClient.isOpen) {
      const data = await redisClient.get(key)
      return data ? JSON.parse(data) : null
    }
    return null
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

export const deleteCache = async (key: string): Promise<void> => {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.del(key)
    }
  } catch (error) {
    console.error("Redis delete error:", error)
  }
}
