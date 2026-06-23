"use client";

import Link from "next/link";
import { useState } from "react";
import { healthService } from "@/features/health/services/healthService";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [healthResult, setHealthResult] = useState("");
  const [error, setError] = useState("");

  async function handleCheckHealth() {
    setLoading(true);
    setError("");
    setHealthResult("");

    try {
      const response = await healthService.check();
      setHealthResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Health check failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <h1 className="mb-4 text-4xl font-bold">Frontend Foundation</h1>

      <p className="mb-6 text-gray-600">Next.js frontend project is running.</p>

      <div className="flex gap-3">
        <button
          onClick={handleCheckHealth}
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check API Health"}
        </button>

        <Link href="/login" className="rounded-md border px-4 py-2">
          Go to Login
        </Link>
      </div>

      {healthResult && (
        <pre className="mt-6 overflow-auto rounded-md bg-gray-100 p-4 text-sm">
          {healthResult}
        </pre>
      )}

      {error && (
        <p className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </main>
  );
}
