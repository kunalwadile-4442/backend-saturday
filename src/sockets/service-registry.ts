import type { ServiceRegistry } from "../types/socket.types"
import { UgCourseService } from "../services/socket/ug-course.service"
import { UserSocketService } from "../services/socket/user.service"

// Register all socket services here
export const serviceRegistry: ServiceRegistry = {
  ugCourseService: {
    list: UgCourseService.list,
    create: UgCourseService.create,
    update: UgCourseService.update,
    delete: UgCourseService.delete,
  },
  userService: {
    list: UserSocketService.list,
    update: UserSocketService.update,
    getById: UserSocketService.getById,
  },
}
