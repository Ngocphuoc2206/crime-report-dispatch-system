import type { LoginResult } from "@/features/auth/types/auth.types";

const AUTH_SESSION_KEY = "internalAuthSession";
const ACCESS_TOKEN_KEY = "accessToken";

function clearStorage(storage: Storage) {
  storage.removeItem(AUTH_SESSION_KEY);
  storage.removeItem(ACCESS_TOKEN_KEY);
}

export const authSessionStorage = {
  save: (result: LoginResult, rememberMe: boolean) => {
    if (typeof window === "undefined") return;

    const storage = rememberMe ? localStorage : sessionStorage;
    const unusedStorage = rememberMe ? sessionStorage : localStorage;

    clearStorage(unusedStorage);
    storage.setItem(AUTH_SESSION_KEY, JSON.stringify(result));
    storage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
  },

  get: (): LoginResult | null => {
    if (typeof window === "undefined") return null;

    const rawValue =
      sessionStorage.getItem(AUTH_SESSION_KEY) ??
      localStorage.getItem(AUTH_SESSION_KEY);

    if (!rawValue) return null;

    try {
      return JSON.parse(rawValue) as LoginResult;
    } catch {
      return null;
    }
  },

  clear: () => {
    if (typeof window === "undefined") return;

    clearStorage(localStorage);
    clearStorage(sessionStorage);
  },
};
