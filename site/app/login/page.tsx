"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Ошибка входа");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="relative inline-block w-36 h-12">
            <Image src="/images/logo-brown.png" alt="RAMO" fill className="object-contain" sizes="9rem" />
          </Link>
          <p className="mt-2 text-muted">Панель управления</p>
        </div>

        <div className="rounded-3xl bg-surface p-8 shadow-lg border border-border-light">
          <h1 className="font-serif text-2xl text-center">Вход</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Логин</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background transition-colors"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent px-8 py-3.5 text-white font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="text-accent hover:text-accent-dark">← Вернуться на сайт</Link>
        </p>
      </div>
    </div>
  );
}
