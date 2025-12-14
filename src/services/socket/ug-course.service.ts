import Course from "../../models/course.model"
import type { SocketResponse, ListResponse } from "../../types/socket.types"
import { SocketResponseUtil } from "../../utils/socket-response.util"

export class UgCourseService {
  static async list(payload: any, request: any): Promise<SocketResponse> {
    try {
      const { query = "", limit = 10, page = 1 } = payload

      const pageNum = Number.parseInt(page as string)
      const limitNum = Number.parseInt(limit as string)
      const skip = (pageNum - 1) * limitNum

      // Build search query
      const searchQuery: any = {
        graduation_type: "ug",
        deleted_at: null,
      }

      if (query) {
        searchQuery.$or = [
          { course_name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ]
      }

      // Get courses and total count
      const [courses, totalCount] = await Promise.all([
        Course.find(searchQuery).sort({ order_index: 1 }).skip(skip).limit(limitNum).lean(),
        Course.countDocuments(searchQuery),
      ])

      const responseData: ListResponse<any> = {
        items: courses,
        totalCount,
        paginationData: {
          total_records: totalCount,
          record_limit: limitNum,
          current_page: pageNum,
        },
      }

      return SocketResponseUtil.success("ug_courses_found", responseData, request)
    } catch (error) {
      return SocketResponseUtil.error(
        "failed_to_fetch_courses",
        [error instanceof Error ? error.message : "Unknown error"],
        request,
      )
    }
  }

  static async create(payload: any, request: any): Promise<SocketResponse> {
    try {
      const course = await Course.create({
        ...payload,
        graduation_type: "ug",
      })

      return SocketResponseUtil.success("course_created_successfully", course, request)
    } catch (error) {
      return SocketResponseUtil.error(
        "failed_to_create_course",
        [error instanceof Error ? error.message : "Unknown error"],
        request,
      )
    }
  }

  static async update(payload: any, request: any): Promise<SocketResponse> {
    try {
      const { id, ...updateData } = payload

      if (!id) {
        return SocketResponseUtil.validationError(["Course ID is required"], request)
      }

      const course = await Course.findByIdAndUpdate(id, updateData, {
        new: true,
      })

      if (!course) {
        return SocketResponseUtil.error("course_not_found", ["Course not found"], request)
      }

      return SocketResponseUtil.success("course_updated_successfully", course, request)
    } catch (error) {
      return SocketResponseUtil.error(
        "failed_to_update_course",
        [error instanceof Error ? error.message : "Unknown error"],
        request,
      )
    }
  }

  static async delete(payload: any, request: any): Promise<SocketResponse> {
    try {
      const { id } = payload

      if (!id) {
        return SocketResponseUtil.validationError(["Course ID is required"], request)
      }

      const course = await Course.findByIdAndUpdate(id, { deleted_at: new Date() }, { new: true })

      if (!course) {
        return SocketResponseUtil.error("course_not_found", ["Course not found"], request)
      }

      return SocketResponseUtil.success("course_deleted_successfully", course, request)
    } catch (error) {
      return SocketResponseUtil.error(
        "failed_to_delete_course",
        [error instanceof Error ? error.message : "Unknown error"],
        request,
      )
    }
  }
}
