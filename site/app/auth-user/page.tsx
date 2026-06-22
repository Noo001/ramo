"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function AuthUserPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/profile";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/user/login" : "/api/auth/user/register";
    const body = mode === "login" ? { phone, password } : { phone, password, name };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка");
        return;
      }

      router.push(returnUrl);
      router.refresh();
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface rounded-3xl shadow-sm border border-border-light p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <span aria-hidden="true">←</span> На главную
        </Link>

        <div className="mt-6 mb-2">
          <Image src="/images/logo-brown.png" alt="RAMO" width={120} height={40} className="h-8 w-auto object-contain" />
        </div>

        <h1 className="font-serif text-3xl mt-4 mb-2">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h1>
        <p className="text-muted mb-6">В личный кабинет RAMO</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              mode === "login" ? "bg-foreground text-background" : "bg-background-alt text-muted"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              mode === "register" ? "bg-foreground text-background" : "bg-background-alt text-muted"
            }`}
          >
            Регистрация
          </button>
        </div>

        {error ? <p className="text-red-600 text-sm mb-4">{error}</p> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" ? (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
                placeholder="Иван"
              />
            </div>
          ) : null}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
              placeholder="+7 (900) 000-00-00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent text-white py-3 font-medium hover:bg-accent-hover transition disabled:opacity-50"
          >
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AuthUserPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted">Загрузка...</p></main>}>
      <AuthUserPageContent />
    </Suspense>
  );
}
