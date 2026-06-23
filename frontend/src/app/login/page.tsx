"use client";

import { FormEvent, useState } from "react";
import { authService } from "@/features/auth/services/authService";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await authService.login({
        username,
        password,
      });

      const token = response.accessToken;

      if (!token) {
        throw new Error("Login response did not include an access token");
      }

      localStorage.setItem("accessToken", token);
      setMessage("Login API call success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </main>
  );
}
