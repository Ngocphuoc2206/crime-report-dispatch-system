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
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("accessToken") ??
          localStorage.getItem("accessToken")
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

function getAuthToken() {
  return typeof window !== "undefined"
    ? sessionStorage.getItem("accessToken") ?? localStorage.getItem("accessToken")
    : null;
}

async function requestBlob(path: string, options: RequestOptions = {}) {
  const url = `${env.apiBaseUrl}${path}`;
  const headers = new Headers(options.headers);

  if (options.auth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.blob();
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

  postForm: <T>(path: string, body: FormData, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body,
    }),

  put: <T, B = unknown>(path: string, body?: B, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T, B = unknown>(path: string, body?: B, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),

  blob: (path: string, options?: RequestOptions) =>
    requestBlob(path, { ...options, method: "GET" }),
};
