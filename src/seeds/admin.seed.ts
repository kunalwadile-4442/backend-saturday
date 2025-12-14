
import bcrypt from "bcryptjs"
import userModel from "../models/user.model"
import { connectDatabase } from "../config/database"

const seedAdmin = async () => {
  try {
    await connectDatabase()

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123"

    const existingAdmin = await userModel.findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log("⚠️ Admin already exists")
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    await userModel.create({
      first_name: "Super",
      last_name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    })

    console.log("✅ Admin user created successfully")
    process.exit(0)
  } catch (error) {
    console.error("❌ Admin seed failed:", error)
    process.exit(1)
  }
}

seedAdmin()