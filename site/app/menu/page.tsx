"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MenuPage from "@/components/menu/MenuPage";

function MenuPageWrapper() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId") || undefined;
  return <MenuPage tableId={tableId} />;
}

export default function PublicMenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Загрузка...</div>}>
      <MenuPageWrapper />
    </Suspense>
  );
}
