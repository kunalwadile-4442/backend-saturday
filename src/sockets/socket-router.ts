import type { Socket } from "socket.io"
import type { SocketRequest, SocketResponse } from "../types/socket.types"
import { serviceRegistry } from "./service-registry"
import { SocketResponseUtil } from "../utils/socket-response.util"

export class SocketRouter {
  static async handleRequest(socket: Socket, request: SocketRequest): Promise<SocketResponse> {
    try {
      const { type, action, payload } = request

      // Validate request structure
      if (!type || !action) {
        return SocketResponseUtil.validationError(["Type and action are required"], request)
      }

      // Find the service
      const service = serviceRegistry[type]
      if (!service) {
        return SocketResponseUtil.error("service_not_found", [`Service '${type}' not found`], request)
      }

      // Find the action handler
      const handler = service[action]
      if (!handler) {
        return SocketResponseUtil.error(
          "action_not_found",
          [`Action '${action}' not found in service '${type}'`],
          request,
        )
      }

      // Execute the handler
      const response = await handler(payload, request)
      return response
    } catch (error) {
      return SocketResponseUtil.error(
        "internal_server_error",
        [error instanceof Error ? error.message : "Unknown error"],
        request,
      )
    }
  }
}
