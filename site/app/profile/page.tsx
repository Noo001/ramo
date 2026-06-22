"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface User {
  id: number;
  phone: string;
  name: string | null;
  points: number;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/user/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/auth-user"))
      .finally(() => setLoading(false));
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/user/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted">Загрузка...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto bg-surface rounded-3xl shadow-sm border border-border-light p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
          <span aria-hidden="true">←</span> На главную
        </Link>

        <div className="mt-6 mb-2">
          <Image src="/images/logo-brown.png" alt="RAMO" width={120} height={40} className="h-8 w-auto object-contain" />
        </div>

        <h1 className="font-serif text-3xl mt-4 mb-2">Личный кабинет</h1>
        <p className="text-muted mb-6">{user.name || "Гость"}</p>

        <div className="bg-foreground text-white rounded-2xl p-6 mb-6">
          <p className="text-white/70 text-sm">Баллы лояльности</p>
          <p className="font-serif text-4xl mt-1">{user.points.toLocaleString("ru-RU")}</p>
          <p className="text-white/60 text-sm mt-2">1 балл = 1 ₽</p>
        </div>

        <div className="space-y-3 text-foreground">
          <p>
            <span className="text-muted">Телефон:</span> {user.phone}
          </p>
          <p>
            <span className="text-muted">В программе с:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString("ru-RU")}
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full mt-8 rounded-full border border-border py-3 font-medium hover:bg-background-alt transition"
        >
          Выйти
        </button>
      </div>
    </main>
  );
}
