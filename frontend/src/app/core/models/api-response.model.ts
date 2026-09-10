export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Pagination<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}
