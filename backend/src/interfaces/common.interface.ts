export interface ISuccessResponse<T> {
 message: string
 data: T
}

export type Pagination<T> = {
 data: T
 pagination: {
  current_page: number
  limit: number
  skip: number
  total: number
 }
}

export interface BackendErrorResponse {
 status: number
 message: string
}
