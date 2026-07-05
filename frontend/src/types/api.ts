export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  error?: string;
  detail?: string;
  errorCode?: string;
}
