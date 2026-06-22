"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Users, ArrowRight, Calendar } from "lucide-react";

interface Table {
  id: number;
  zone: "HALL1" | "HALL2" | "TERRACE";
  seats: number;
  isActive: boolean;
}

interface Reservation {
  id: number;
  tableId: number;
  name: string;
  guests: number;
  date: string;
  time: string;
}

const zoneNames: Record<string, string> = {
  HALL1: "Зал 1",
  HALL2: "Зал 2",
  TERRACE: "Летняя веранда",
};

const zoneDescriptions: Record<string, string> = {
  HALL1: "Основной зал у окна",
  HALL2: "Уютный зал в глубине",
  TERRACE: "Летняя веранда",
};

const zoneColors: Record<string, string> = {
  HALL1: "from-accent/10 to-accent/5 border-accent/20",
  HALL2: "from-background-alt to-surface/50 border-border",
  TERRACE: "from-green/10 to-green/5 border-green/20",
};

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function FloorMapPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedDate, setSelectedDate] = useState(formatDateInput(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    loadReservations(selectedDate);
  }, [selectedDate]);

  const loadTables = async () => {
    try {
      const res = await fetch("/api/tables");
      if (!res.ok) throw new Error("Не удалось загрузить карту зала");
      const data = await res.json();
      setTables(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить карту зала");
      setLoading(false);
    }
  };

  const loadReservations = async (date: string) => {
    try {
      const res = await fetch(`/api/reservations?date=${date}`);
      if (!res.ok) throw new Error("Не удалось загрузить бронирования");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const isReserved = (tableId: number) => {
    return reservations.some((r) => r.tableId === tableId);
  };

  const groupedTables = tables.reduce((acc, table) => {
    if (!acc[table.zone]) acc[table.zone] = [];
    acc[table.zone].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted">Загрузка карты зала...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-3xl mb-4">Ошибка загрузки</h1>
          <p className="text-muted">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-accent px-6 py-3 text-white font-medium hover:bg-accent-dark"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 sm:py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-dark text-sm font-medium mb-6"
          >
            ← На главную
          </Link>
          <h1 className="font-serif text-5xl sm:text-6xl font-normal">Карта зала</h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            Выберите дату и свободный стол. Занятые столы отмечены красным.
          </p>
        </div>

        <div className="max-w-sm mx-auto mb-10">
          <label className="block text-sm font-medium text-muted mb-2">Дата бронирования</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="date"
              value={selectedDate}
              min={formatDateInput(new Date())}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface pl-12 pr-4 py-3 outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {["HALL1", "HALL2", "TERRACE"].map((zone) => (
            <div
              key={zone}
              className={`rounded-3xl bg-gradient-to-b ${zoneColors[zone]} border p-6 sm:p-8`}
            >
              <div className="text-center mb-6">
                <h2 className="font-serif text-2xl">{zoneNames[zone]}</h2>
                <p className="text-sm text-muted">{zoneDescriptions[zone]}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(groupedTables[zone] || []).map((table) => {
                  const reserved = isReserved(table.id);
                  return (
                    <button
                      key={table.id}
                      onClick={() => !reserved && setSelectedTable(table)}
                      className={`group relative rounded-2xl border-2 p-5 text-center transition-all ${
                        selectedTable?.id === table.id
                          ? "border-accent bg-white shadow-lg scale-105"
                          : reserved
                          ? "border-red-200 bg-red-50 cursor-not-allowed"
                          : "border-white/80 bg-white/70 hover:bg-white hover:shadow-md"
                      } ${!table.isActive ? "opacity-40 cursor-not-allowed" : ""}`}
                      disabled={!table.isActive || reserved}
                    >
                      <div
                        className={`font-serif text-2xl transition-colors ${
                          reserved ? "text-red-500" : "group-hover:text-accent"
                        }`}
                      >
                        {table.id}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted">
                        <Users className="w-3 h-3" />
                        {table.seats}
                      </div>
                      {reserved && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedTable && (
          <div className="mt-10 rounded-3xl bg-foreground text-white p-8 sm:p-10 text-center animate-fade-in-up">
            <div className="flex items-center justify-center gap-2 text-accent">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">
                {zoneNames[selectedTable.zone]}, стол {selectedTable.id}
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Стол свободен</h2>
            <p className="mt-3 text-white/70">
              {selectedTable.seats} места · {selectedDate ? `на ${selectedDate.split("-").reverse().join(".")}` : ""}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/menu?tableId=${selectedTable.id}`}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 font-medium hover:bg-accent-dark transition-colors"
              >
                Открыть меню стола
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_SITE_PHONE || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 font-medium hover:bg-white/10 transition-colors"
              >
                Забронировать по телефону
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
