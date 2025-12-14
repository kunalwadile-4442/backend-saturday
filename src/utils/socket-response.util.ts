import type { SocketRequest, SocketResponse } from "../types/socket.types"

export class SocketResponseUtil {
  static success<T>(msg: string, data: T, request: SocketRequest): SocketResponse<T> {
    return {
      status: true,
      msg,
      data,
      errors: [],
      request,
    }
  }

  static error(msg: string, errors: string[], request: SocketRequest): SocketResponse {
    return {
      status: false,
      msg,
      errors,
      request,
    }
  }

  static validationError(errors: string[], request: SocketRequest): SocketResponse {
    return {
      status: false,
      msg: "validation_failed",
      errors,
      request,
    }
  }
}
