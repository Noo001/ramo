import { API_BASE_URL } from "./config";
import { Category, Dish, Table, Reservation } from "./types";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchMenu(): Promise<Category[]> {
  return fetchJson<Category[]>("/api/menu");
}

export async function fetchTable(tableId: number): Promise<Table> {
  return fetchJson<Table>(`/api/tables/${tableId}`);
}

export async function fetchTables(): Promise<Table[]> {
  return fetchJson<Table[]>("/api/tables");
}

export async function fetchReservations(date: string): Promise<Reservation[]> {
  return fetchJson<Reservation[]>(`/api/reservations?date=${encodeURIComponent(date)}`);
}

export async function createOrder(
  tableId: number,
  items: { dishId: number; quantity: number }[],
  comment?: string,
  pointsToSpend?: number
) {
  return fetchJson<{
    success: boolean;
    orderId: number;
    finalTotal: number;
    pointsEarned: number;
    pointsSpent: number;
    remainingPoints: number;
  }>("/api/order", {
    method: "POST",
    body: JSON.stringify({ tableId, items, comment, pointsToSpend }),
  });
}

export async function createReservation(data: {
  tableId: number;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  comment?: string;
}) {
  return fetchJson<Reservation>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
