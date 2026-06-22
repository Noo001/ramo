"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import Link from "next/link";
import Image from "next/image";
import {
  UtensilsCrossed,
  LayoutGrid,
  ClipboardList,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Users,
  BarChart3,
  Save,
  Trash2,
  Edit2,
  Download,
  QrCode,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  sortOrder: number;
}

interface Dish {
  id: number;
  name: string;
  description: string | null;
  price: number;
  weight: string | null;
  image: string | null;
  categoryId: number;
  isActive: boolean;
  isStopListed: boolean;
  category: Category;
}

interface Table {
  id: number;
  zone: "HALL1" | "HALL2" | "TERRACE";
  seats: number;
  isActive: boolean;
}

interface Reservation {
  id: number;
  tableId: number;
  table: Table;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  comment: string | null;
  status: string;
  createdAt: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

interface EventRequest {
  id: number;
  eventType: string;
  guests: string;
  date: string | null;
  budget: string | null;
  name: string;
  phone: string;
  comment: string | null;
  status: string;
  createdAt: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

interface Order {
  id: number;
  status: string;
  total: number;
  comment: string | null;
  createdAt: string;
  table: Table;
  items: { quantity: number; price: number; dish: { name: string } }[];
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

const zoneNames: Record<string, string> = {
  HALL1: "Зал 1",
  HALL2: "Зал 2",
  TERRACE: "Летняя веранда",
};

const statusNames: Record<string, string> = {
  NEW: "Новый",
  CONFIRMED: "Подтверждён",
  READY: "Готов",
  CLOSED: "Закрыт",
  CANCELLED: "Отменён",
};

const statusColors: Record<string, string> = {
  NEW: "bg-accent/10 text-accent-dark",
  CONFIRMED: "bg-blue/10 text-dark-blue",
  READY: "bg-green/10 text-green",
  CLOSED: "bg-background-alt text-muted",
  CANCELLED: "bg-red/10 text-red",
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"menu" | "tables" | "reservations" | "orders" | "crm" | "analytics" | "settings">("menu");
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [settings, setSettings] = useState({
    telegramBotToken: "",
    telegramChatId: "",
    iikoApiLogin: "",
    iikoOrganizationId: "",
    loyaltyEarnPercent: "5",
    loyaltySpendPercent: "30",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, dishRes, tableRes, orderRes, reservationsRes, eventRequestsRes, settingsRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/dishes"),
        fetch("/api/admin/tables"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/reservations"),
        fetch("/api/admin/event-requests"),
        fetch("/api/admin/settings"),
      ]);

      if (catRes.status === 401 || dishRes.status === 401) {
        router.push("/login");
        return;
      }

      const [cats, dishData, tableData, orderData, reservationsData, eventRequestsData, settingsData] = await Promise.all([
        catRes.json(),
        dishRes.json(),
        tableRes.json(),
        orderRes.json(),
        reservationsRes.json(),
        eventRequestsRes.json(),
        settingsRes.json(),
      ]);

      setCategories(cats);
      setDishes(dishData);
      setTables(tableData);
      setOrders(orderData);
      setReservations(reservationsData);
      setEventRequests(eventRequestsData);
      setSettings({
        telegramBotToken: settingsData.telegramBotToken || "",
        telegramChatId: settingsData.telegramChatId || "",
        iikoApiLogin: settingsData.iikoApiLogin || "",
        iikoOrganizationId: settingsData.iikoOrganizationId || "",
        loyaltyEarnPercent: settingsData.loyaltyEarnPercent || "5",
        loyaltySpendPercent: settingsData.loyaltySpendPercent || "30",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const saveSettings = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramBotToken: settings.telegramBotToken,
        telegramChatId: settings.telegramChatId,
        iikoApiLogin: settings.iikoApiLogin,
        iikoOrganizationId: settings.iikoOrganizationId,
        loyaltyEarnPercent: settings.loyaltyEarnPercent,
        loyaltySpendPercent: settings.loyaltySpendPercent,
      }),
    });
    if (res.ok) showMessage("Настройки сохранены");
  };

  const syncIiko = async () => {
    showMessage("Синхронизация...");
    const res = await fetch("/api/admin/sync-iiko", { method: "POST" });
    const data = await res.json();
    showMessage(data.message || "Готово");
  };

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted">Загрузка...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "menu", label: "Меню", icon: UtensilsCrossed },
    { key: "tables", label: "Столы", icon: LayoutGrid },
    { key: "reservations", label: "Бронирования", icon: Calendar },
    { key: "orders", label: "Заказы", icon: ClipboardList },
    { key: "crm", label: "CRM", icon: Users },
    { key: "analytics", label: "Аналитика", icon: BarChart3 },
    { key: "settings", label: "Настройки", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border-light sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="relative w-24 h-8">
                <Image src="/images/logo-brown.png" alt="RAMO" fill className="object-contain object-left" sizes="6rem" />
              </Link>
              <span className="text-muted text-sm hidden sm:inline">/ Админка</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-foreground text-background shadow-md"
                  : "bg-surface text-muted hover:text-foreground border border-border-light"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-green-800 flex items-center gap-2 animate-fade-in-up">
            <CheckCircle2 className="w-5 h-5" />
            {message}
          </div>
        )}

        {activeTab === "menu" && (
          <MenuTab categories={categories} dishes={dishes} onUpdate={fetchData} showMessage={showMessage} />
        )}
        {activeTab === "tables" && <TablesTab tables={tables} onUpdate={fetchData} />}
        {activeTab === "reservations" && (
          <ReservationsTab reservations={reservations} tables={tables} onUpdate={fetchData} showMessage={showMessage} />
        )}
        {activeTab === "orders" && (
          <OrdersTab orders={orders} onUpdateStatus={updateOrderStatus} />
        )}
        {activeTab === "crm" && (
          <EventRequestsTab eventRequests={eventRequests} onUpdate={fetchData} showMessage={showMessage} />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab orders={orders} reservations={reservations} eventRequests={eventRequests} />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            settings={settings}
            onChange={setSettings}
            onSave={saveSettings}
            onSync={syncIiko}
          />
        )}
      </div>
    </div>
  );
}

function MenuTab({
  categories,
  dishes,
  onUpdate,
  showMessage,
}: {
  categories: Category[];
  dishes: Dish[];
  onUpdate: () => void;
  showMessage: (text: string) => void;
}) {
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    categoryId: "",
    image: "",
    isActive: true,
    isStopListed: false,
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      weight: "",
      categoryId: categories[0]?.id.toString() || "",
      image: "",
      isActive: true,
      isStopListed: false,
    });
    setEditingDish(null);
  };

  useEffect(() => {
    if (categories.length > 0 && !form.categoryId) {
      setForm((f) => ({ ...f, categoryId: categories[0].id.toString() }));
    }
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingDish ? `/api/admin/dishes/${editingDish.id}` : "/api/admin/dishes";
    const method = editingDish ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
      }),
    });

    if (res.ok) {
      showMessage(editingDish ? "Блюдо обновлено" : "Блюдо добавлено");
      resetForm();
      onUpdate();
    }
  };

  const editDish = (dish: Dish) => {
    setEditingDish(dish);
    setForm({
      name: dish.name,
      description: dish.description || "",
      price: dish.price.toString(),
      weight: dish.weight || "",
      categoryId: dish.categoryId.toString(),
      image: dish.image || "",
      isActive: dish.isActive,
      isStopListed: dish.isStopListed,
    });
  };

  const deleteDish = async (id: number) => {
    if (!confirm("Удалить блюдо?")) return;
    await fetch(`/api/admin/dishes/${id}`, { method: "DELETE" });
    showMessage("Блюдо удалено");
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light"
      >
        <h2 className="font-serif text-2xl mb-6">
          {editingDish ? "Редактировать блюдо" : "Добавить блюдо"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="Название *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Цена *"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          />
          <input
            placeholder="Вес / объём"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
          />
          <input
            placeholder="URL изображения"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="sm:col-span-2 rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
          />
          <textarea
            placeholder="Описание"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="sm:col-span-2 rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background resize-none"
            rows={3}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
            />
            Активно
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isStopListed}
              onChange={(e) => setForm({ ...form, isStopListed: e.target.checked })}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
            />
            В стоп-листе
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-white font-medium hover:bg-accent-dark transition-colors"
          >
            <Save className="w-4 h-4" />
            {editingDish ? "Сохранить" : "Добавить"}
          </button>
          {editingDish && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-border px-6 py-2.5 text-muted hover:text-foreground hover:bg-background-alt transition-colors"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="rounded-3xl bg-surface shadow-sm border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background-alt">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Блюдо</th>
                <th className="px-6 py-4 text-left font-medium">Категория</th>
                <th className="px-6 py-4 text-left font-medium">Цена</th>
                <th className="px-6 py-4 text-left font-medium">Статус</th>
                <th className="px-6 py-4 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {dishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-background-alt/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {dish.image && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-background-alt shrink-0">
                          <img src={dish.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{dish.name}</div>
                        {dish.weight && <div className="text-xs text-muted">{dish.weight}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{dish.category.name}</td>
                  <td className="px-6 py-4 font-medium">{dish.price} ₽</td>
                  <td className="px-6 py-4">
                    {!dish.isActive && (
                      <span className="rounded-full bg-background-alt px-3 py-1 text-xs">Неактивно</span>
                    )}
                    {dish.isStopListed && (
                      <span className="rounded-full bg-red/10 text-red px-3 py-1 text-xs">
                        Стоп-лист
                      </span>
                    )}
                    {dish.isActive && !dish.isStopListed && (
                      <span className="rounded-full bg-green/10 text-green px-3 py-1 text-xs">
                        Активно
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editDish(dish)}
                        className="p-2 rounded-full hover:bg-background-alt text-accent hover:text-accent-dark"
                        title="Изменить"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="p-2 rounded-full hover:bg-red-50 text-red hover:text-red/80"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TablesTab({ tables, onUpdate }: { tables: Table[]; onUpdate: () => void }) {
  const [form, setForm] = useState({ id: "", zone: "HALL1" as Table["zone"], seats: "4" });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrTable, setQrTable] = useState<Table | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(form.id),
        zone: form.zone,
        seats: Number(form.seats),
      }),
    });
    setForm({ id: "", zone: "HALL1", seats: "4" });
    onUpdate();
  };

  const generateQR = async (table: Table) => {
    const origin = window.location.origin;
    const url = `${origin}/menu?tableId=${table.id}`;
    const dataUrl = await QRCode.toDataURL(url, { width: 400, margin: 2 });
    setQrCode(dataUrl);
    setQrTable(table);
  };

  const groupedTables = tables.reduce((acc, table) => {
    if (!acc[table.zone]) acc[table.zone] = [];
    acc[table.zone].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light"
      >
        <h2 className="font-serif text-2xl mb-6">Добавить стол</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          <input
            placeholder="Номер стола"
            type="number"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          />
          <select
            value={form.zone}
            onChange={(e) => setForm({ ...form, zone: e.target.value as Table["zone"] })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
          >
            <option value="HALL1">Зал 1</option>
            <option value="HALL2">Зал 2</option>
            <option value="TERRACE">Летняя веранда</option>
          </select>
          <input
            placeholder="Мест"
            type="number"
            value={form.seats}
            onChange={(e) => setForm({ ...form, seats: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-white font-medium hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </button>
        </div>
      </form>

      <div className="grid lg:grid-cols-3 gap-6">
        {["HALL1", "HALL2", "TERRACE"].map((zone) => (
          <div key={zone} className="rounded-3xl bg-surface p-6 shadow-sm border border-border-light">
            <h3 className="font-serif text-xl mb-4">{zoneNames[zone]}</h3>
            <div className="grid grid-cols-3 gap-2">
              {(groupedTables[zone] || []).map((table) => (
                <button
                  key={table.id}
                  onClick={() => generateQR(table)}
                  className="group rounded-xl border border-border p-3 text-center hover:border-accent hover:shadow-sm transition-all"
                >
                  <div className="font-serif text-xl group-hover:text-accent transition-colors">
                    {table.id}
                  </div>
                  <div className="text-xs text-muted">{table.seats} мест</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {qrCode && qrTable && (
        <div className="rounded-3xl bg-surface p-8 shadow-sm border border-border-light text-center">
          <h3 className="font-serif text-2xl mb-2">
            QR-код: {zoneNames[qrTable.zone]}, стол {qrTable.id}
          </h3>
          <p className="text-muted mb-6">Отсканируйте, чтобы открыть меню стола</p>
          <img src={qrCode} alt="QR код стола" className="mx-auto rounded-2xl" />
          <a
            href={qrCode}
            download={`ramo-table-${qrTable.zone}-${qrTable.id}.png`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white font-medium hover:bg-accent-dark"
          >
            <Download className="w-4 h-4" />
            Скачать QR
          </a>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders, onUpdateStatus }: { orders: Order[]; onUpdateStatus: (id: number, status: string) => void }) {
  return (
    <div className="space-y-4">
      {orders.length === 0 && (
        <div className="rounded-3xl bg-surface p-12 text-center shadow-sm border border-border-light">
          <ClipboardList className="w-12 h-12 text-border mx-auto" />
          <p className="mt-4 text-muted">Заказов пока нет</p>
        </div>
      )}
      {orders.map((order) => (
        <div key={order.id} className="rounded-3xl bg-surface p-6 shadow-sm border border-border-light">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl">Заказ #{order.id}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                  {statusNames[order.status] || order.status}
                </span>
              </div>
              <p className="text-sm text-muted mt-1">
                {zoneNames[order.table.zone]}, стол {order.table.id} ·{" "}
                {new Date(order.createdAt).toLocaleString("ru-RU")}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-accent bg-background"
            >
              {Object.entries(statusNames).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <ul className="mt-5 space-y-2 text-sm">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex justify-between py-1 border-b border-border-light last:border-0">
                <span>
                  {item.dish.name} × {item.quantity}
                </span>
                <span className="font-medium">{item.price * item.quantity} ₽</span>
              </li>
            ))}
          </ul>

          {order.comment && <p className="mt-4 text-sm text-muted">💬 {order.comment}</p>}

          <div className="mt-5 pt-4 border-t border-border-light flex items-center justify-between">
            <span className="text-muted">Итого</span>
            <span className="font-serif text-2xl">{order.total} ₽</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReservationsTab({
  reservations,
  tables,
  onUpdate,
  showMessage,
}: {
  reservations: Reservation[];
  tables: Table[];
  onUpdate: () => void;
  showMessage: (msg: string) => void;
}) {
  const [form, setForm] = useState({
    tableId: "",
    name: "",
    phone: "",
    guests: "2",
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: Number(form.tableId),
        name: form.name,
        phone: form.phone,
        guests: Number(form.guests),
        date: form.date,
        time: form.time,
        comment: form.comment,
      }),
    });
    if (res.ok) {
      showMessage("Бронирование создано");
      setForm({ ...form, name: "", phone: "", comment: "" });
      onUpdate();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Отменить бронирование?")) return;
    const res = await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
    if (res.ok) {
      showMessage("Бронирование отменено");
      onUpdate();
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light"
      >
        <h2 className="font-serif text-2xl mb-6">Новое бронирование</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={form.tableId}
            onChange={(e) => setForm({ ...form, tableId: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          >
            <option value="">Стол</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {zoneNames[table.zone]}, стол {table.id} ({table.seats} мест)
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Имя гостя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          />
          <input
            type="number"
            placeholder="Гостей"
            min={1}
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          />
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background"
            required
          />
          <input
            type="text"
            placeholder="Комментарий"
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background sm:col-span-2"
          />
        </div>
        <button
          type="submit"
          className="mt-6 flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white font-medium hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Забронировать
        </button>
      </form>

      <div className="rounded-3xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light">
        <h2 className="font-serif text-2xl mb-6">Бронирования</h2>
        {reservations.length === 0 ? (
          <p className="text-muted">Нет бронирований</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted border-b border-border-light">
                  <th className="pb-3 font-medium">Стол</th>
                  <th className="pb-3 font-medium">Имя</th>
                  <th className="pb-3 font-medium">Телефон</th>
                  <th className="pb-3 font-medium">Гостей</th>
                  <th className="pb-3 font-medium">Дата</th>
                  <th className="pb-3 font-medium">Время</th>
                  <th className="pb-3 font-medium">Комментарий</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-border-light last:border-0">
                    <td className="py-4">
                      {zoneNames[reservation.table.zone]}, стол {reservation.table.id}
                    </td>
                    <td className="py-4">{reservation.name}</td>
                    <td className="py-4">{reservation.phone}</td>
                    <td className="py-4">{reservation.guests}</td>
                    <td className="py-4">{reservation.date.split("-").reverse().join(".")}</td>
                    <td className="py-4">{reservation.time}</td>
                    <td className="py-4 text-muted">{reservation.comment || "—"}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="p-2 rounded-full hover:bg-red-50 text-red hover:text-red/80"
                        title="Отменить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const crmStatusNames: Record<string, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  CLOSED: "Закрыта",
  CANCELLED: "Отменена",
};

function EventRequestsTab({
  eventRequests,
  onUpdate,
  showMessage,
}: {
  eventRequests: EventRequest[];
  onUpdate: () => void;
  showMessage: (msg: string) => void;
}) {
  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/event-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      showMessage("Статус обновлён");
      onUpdate();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить заявку?")) return;
    const res = await fetch(`/api/admin/event-requests/${id}`, { method: "DELETE" });
    if (res.ok) {
      showMessage("Заявка удалена");
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light">
        <h2 className="font-serif text-2xl mb-6">Заявки на мероприятия</h2>
        {eventRequests.length === 0 ? (
          <p className="text-muted">Заявок пока нет</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted border-b border-border-light">
                  <th className="pb-3 font-medium">Дата заявки</th>
                  <th className="pb-3 font-medium">Тип</th>
                  <th className="pb-3 font-medium">Гостей</th>
                  <th className="pb-3 font-medium">Дата мероприятия</th>
                  <th className="pb-3 font-medium">Бюджет</th>
                  <th className="pb-3 font-medium">Имя</th>
                  <th className="pb-3 font-medium">Телефон</th>
                  <th className="pb-3 font-medium">Комментарий</th>
                  <th className="pb-3 font-medium">UTM</th>
                  <th className="pb-3 font-medium">Статус</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {eventRequests.map((req) => (
                  <tr key={req.id} className="border-b border-border-light last:border-0">
                    <td className="py-4 text-sm">
                      {new Date(req.createdAt).toLocaleString("ru-RU")}
                    </td>
                    <td className="py-4">{req.eventType}</td>
                    <td className="py-4">{req.guests}</td>
                    <td className="py-4">{req.date ? req.date.split("-").reverse().join(".") : "—"}</td>
                    <td className="py-4">{req.budget || "—"}</td>
                    <td className="py-4">{req.name}</td>
                    <td className="py-4">{req.phone}</td>
                    <td className="py-4 text-muted max-w-xs truncate">{req.comment || "—"}</td>
                    <td className="py-4 text-xs text-muted">
                      {req.utmSource || req.utmMedium || req.utmCampaign ? (
                        <div className="space-y-0.5">
                          {req.utmSource && <div>source: {req.utmSource}</div>}
                          {req.utmMedium && <div>medium: {req.utmMedium}</div>}
                          {req.utmCampaign && <div>campaign: {req.utmCampaign}</div>}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-4">
                      <select
                        value={req.status}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                        className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-accent bg-background"
                      >
                        {Object.entries(crmStatusNames).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2 rounded-full hover:bg-red-50 text-red hover:text-red/80"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsTab({
  orders,
  reservations,
  eventRequests,
}: {
  orders: Order[];
  reservations: Reservation[];
  eventRequests: EventRequest[];
}) {
  type ChannelRow = { source: string; orders: number; ordersSum: number; reservations: number; events: number };

  const channels = new Map<string, ChannelRow>();

  const touch = (source: string | null | undefined) => {
    const key = source?.trim() || "organic / direct";
    if (!channels.has(key)) {
      channels.set(key, { source: key, orders: 0, ordersSum: 0, reservations: 0, events: 0 });
    }
    return channels.get(key)!;
  };

  orders.forEach((order) => {
    const row = touch(order.utmSource);
    row.orders += 1;
    row.ordersSum += order.total;
  });

  reservations.forEach((reservation) => {
    touch(reservation.utmSource).reservations += 1;
  });

  eventRequests.forEach((req) => {
    touch(req.utmSource).events += 1;
  });

  const rows = Array.from(channels.values()).sort((a, b) => b.ordersSum - a.ordersSum);
  const totalOrdersSum = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-surface p-6 shadow-sm border border-border-light">
          <p className="text-sm text-muted">Заказов</p>
          <p className="mt-2 font-serif text-3xl">{orders.length}</p>
        </div>
        <div className="rounded-3xl bg-surface p-6 shadow-sm border border-border-light">
          <p className="text-sm text-muted">Выручка</p>
          <p className="mt-2 font-serif text-3xl">{totalOrdersSum.toLocaleString("ru-RU")} ₽</p>
        </div>
        <div className="rounded-3xl bg-surface p-6 shadow-sm border border-border-light">
          <p className="text-sm text-muted">Бронирований</p>
          <p className="mt-2 font-serif text-3xl">{reservations.length}</p>
        </div>
        <div className="rounded-3xl bg-surface p-6 shadow-sm border border-border-light">
          <p className="text-sm text-muted">Заявок на мероприятия</p>
          <p className="mt-2 font-serif text-3xl">{eventRequests.length}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light">
        <h2 className="font-serif text-2xl mb-6">Аналитика по каналам (UTM source)</h2>
        {rows.length === 0 ? (
          <p className="text-muted">Нет данных</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted border-b border-border-light">
                  <th className="pb-3 font-medium">Канал</th>
                  <th className="pb-3 font-medium">Заказы</th>
                  <th className="pb-3 font-medium">Выручка</th>
                  <th className="pb-3 font-medium">Бронирования</th>
                  <th className="pb-3 font-medium">Заявки</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.source} className="border-b border-border-light last:border-0">
                    <td className="py-4 font-medium">{row.source}</td>
                    <td className="py-4">{row.orders}</td>
                    <td className="py-4">{row.ordersSum.toLocaleString("ru-RU")} ₽</td>
                    <td className="py-4">{row.reservations}</td>
                    <td className="py-4">{row.events}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab({
  settings,
  onChange,
  onSave,
  onSync,
}: {
  settings: {
    telegramBotToken: string;
    telegramChatId: string;
    iikoApiLogin: string;
    iikoOrganizationId: string;
    loyaltyEarnPercent: string;
    loyaltySpendPercent: string;
  };
  onChange: (s: {
    telegramBotToken: string;
    telegramChatId: string;
    iikoApiLogin: string;
    iikoOrganizationId: string;
    loyaltyEarnPercent: string;
    loyaltySpendPercent: string;
  }) => void;
  onSave: () => void;
  onSync: () => void;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-3xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl">Telegram уведомления</h2>
            <p className="text-sm text-muted">Заказы будут приходить в чат</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Bot Token</label>
            <input
              type="text"
              value={settings.telegramBotToken}
              onChange={(e) => onChange({ ...settings, telegramBotToken: e.target.value })}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background font-mono text-sm"
              placeholder="123456:ABC-DEF..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Chat ID</label>
            <input
              type="text"
              value={settings.telegramChatId}
              onChange={(e) => onChange({ ...settings, telegramChatId: e.target.value })}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background font-mono text-sm"
              placeholder="-1001234567890"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border-light space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">iiko API Login</label>
            <input
              type="text"
              value={settings.iikoApiLogin}
              onChange={(e) => onChange({ ...settings, iikoApiLogin: e.target.value })}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background font-mono text-sm"
              placeholder="username@ramo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              iiko Organization ID
              <span className="text-muted/60 font-normal ml-1">(опционально)</span>
            </label>
            <input
              type="text"
              value={settings.iikoOrganizationId}
              onChange={(e) => onChange({ ...settings, iikoOrganizationId: e.target.value })}
              className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background font-mono text-sm"
              placeholder="Автоматически при первой синхронизации"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border-light space-y-4">
          <div>
            <h3 className="font-serif text-lg mb-1">Программа лояльности</h3>
            <p className="text-sm text-muted">Настройте начисление и списание баллов</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Начисление, %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.loyaltyEarnPercent}
                onChange={(e) => onChange({ ...settings, loyaltyEarnPercent: e.target.value })}
                className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">Оплата баллами, %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.loyaltySpendPercent}
                onChange={(e) => onChange({ ...settings, loyaltySpendPercent: e.target.value })}
                className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent bg-background font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onSave}
          className="mt-6 flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white font-medium hover:bg-accent-dark transition-colors"
        >
          <Save className="w-4 h-4" />
          Сохранить настройки
        </button>
      </div>

      <div className="rounded-3xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-background-alt flex items-center justify-center text-muted">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl">Синхронизация с iiko</h2>
            <p className="text-sm text-muted">Обновить меню и стоп-лист</p>
          </div>
        </div>

        <p className="text-muted leading-relaxed">
          При настроенном API логине кнопка обновляет категории, блюда, цены и стоп-лист из iiko.
          Если Organization ID не указан, он будет определён автоматически при первой синхронизации.
          Меню также синхронизируется автоматически каждую ночь в 03:00.
        </p>

        <button
          onClick={onSync}
          className="mt-6 flex items-center gap-2 rounded-full border border-border px-6 py-3 text-foreground font-medium hover:bg-background-alt transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Синхронизировать с iiko
        </button>
      </div>
    </div>
  );
}
