import mongoose, { Schema, type Document } from "mongoose"

export interface ICourse extends Document {
  _id: string
  course_name: string
  graduation_type: "ug" | "pg"
  description: string
  active: boolean
  deleted_at: Date | null
  currency_code: string
  currency_symbol: string
  fees: number
  course_img_url: string | null
  order_index: number
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    course_name: { type: String, required: true },
    graduation_type: {
      type: String,
      enum: ["ug", "pg"],
      required: true,
    },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
    deleted_at: { type: Date, default: null },
    currency_code: { type: String, default: "INR" },
    currency_symbol: { type: String, default: "₹" },
    fees: { type: Number, required: true },
    course_img_url: { type: String, default: null },
    order_index: { type: Number, required: true },
  },
  { timestamps: true },
)

export default mongoose.model<ICourse>("Course", CourseSchema)
