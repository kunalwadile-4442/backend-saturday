export interface SocketRequest {
  type: string
  action: string
  payload: Record<string, any>
  demo?: Record<string, any>
}

export interface SocketResponse<T = any> {
  status: boolean
  msg: string
  data?: T
  errors: string[]
  request: SocketRequest
}

export interface PaginationData {
  total_records: number
  record_limit: number
  current_page: number
}

export interface ListResponse<T> {
  items: T[]
  totalCount: number
  paginationData: PaginationData
}

export interface SocketHandler {
  [action: string]: (payload: any, socket: any) => Promise<SocketResponse>
}

export interface ServiceRegistry {
  [serviceName: string]: SocketHandler
}
