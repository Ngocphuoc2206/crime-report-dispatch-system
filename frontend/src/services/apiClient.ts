import { env } from "@/config/env";
import type { ApiErrorResponse, ApiResponse } from "@/types/api";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;

    try {
      const errorBody = (await response.json()) as ApiErrorResponse;
      errorMessage =
        errorBody.message ||
        errorBody.error ||
        errorBody.detail ||
        errorMessage;
    } catch {
      // Ignore JSON parse error
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseBody = (await response.json()) as ApiResponse<T>;

  if (!responseBody.success) {
    throw new Error(responseBody.message || "API request failed");
  }

  return responseBody.data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T, B = unknown>(path: string, body?: B, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T, B = unknown>(path: string, body?: B, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
