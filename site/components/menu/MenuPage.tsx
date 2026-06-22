"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X, Check, ArrowLeft, MapPin, ChevronDown, User } from "lucide-react";
import { getUtmParams, getUtmBody } from "@/lib/utm";

interface Category {
  id: number;
  name: string;
  dishes: Dish[];
}

interface Dish {
  id: number;
  name: string;
  description: string | null;
  price: number;
  weight: string | null;
  image: string | null;
  categoryId: number;
}

interface Table {
  id: number;
  zone: "HALL1" | "HALL2" | "TERRACE";
  seats: number;
}

interface CartItem {
  dish: Dish;
  quantity: number;
}

interface UserProfile {
  id: number;
  phone: string;
  name: string | null;
  points: number;
}

const zoneNames: Record<string, string> = {
  HALL1: "Зал 1",
  HALL2: "Зал 2",
  TERRACE: "Летняя веранда",
};

interface MenuPageProps {
  tableId?: string;
}

const CART_STORAGE_KEY = "ramo-cart";

export default function MenuPage({ tableId }: MenuPageProps) {
  const router = useRouter();
  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [comment, setComment] = useState("");
  const [orderSent, setOrderSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pointsToSpend, setPointsToSpend] = useState(0);

  const isOrderMode = !!tableId;

  useEffect(() => {
    loadMenu();
    loadUser();
    getUtmParams();
    if (isOrderMode) {
      loadTable(tableId);
    }
  }, [tableId, isOrderMode]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const loadUser = async () => {
    try {
      const res = await fetch("/api/auth/user/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      // not logged in
    }
  };

  const loadTable = async (id: string) => {
    try {
      const res = await fetch(`/api/tables/${id}`);
      if (!res.ok) throw new Error("Стол не найден");
      const data = await res.json();
      setTable(data);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить информацию о столе");
    }
  };

  const loadMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Не удалось загрузить меню");
      const data = await res.json();
      const filtered = data.filter((cat: Category) => cat.dishes.length > 0);
      setCategories(filtered);
      if (filtered.length > 0) setActiveCategory(filtered[0].id);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить меню");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.dish.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateQuantity = (dish: Dish, delta: number) => {
    if (delta > 0) {
      addToCart(dish);
    } else {
      removeFromCart(dish.id);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const maxSpendPercent = 30; // default, actual applied on server
  const maxPointsSpend = user ? Math.min(user.points, Math.floor(total * maxSpendPercent / 100)) : 0;
  const finalTotal = Math.max(0, total - pointsToSpend);

  const sendOrder = async () => {
    if (!table || cart.length === 0) return;

    const items = cart.map((item) => ({ dishId: item.dish.id, quantity: item.quantity }));

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: table.id,
        items,
        comment,
        pointsToSpend: user ? Math.min(pointsToSpend, maxPointsSpend) : 0,
        ...getUtmBody(),
      }),
    });

    if (res.ok) {
      setOrderSent(true);
      setCart([]);
      setPointsToSpend(0);
      setShowCart(false);
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const openCart = () => {
    if (!isOrderMode && !user) {
      router.push("/auth-user?returnUrl=/menu");
      return;
    }
    setShowCart(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted">Загрузка меню...</p>
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

  if (orderSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl font-normal">Заказ принят!</h1>
          <p className="mt-4 text-lg text-muted">
            Официант скоро подойдёт к вашему столу. Спасибо, что выбрали RAMO.
          </p>
          <button
            onClick={() => {
              setOrderSent(false);
              setComment("");
            }}
            className="mt-8 rounded-full bg-accent px-8 py-3 text-white font-medium hover:bg-accent-dark"
          >
            Заказать ещё
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <Image src="/images/logo-brown.png" alt="RAMO" width={80} height={24} className="h-6 w-auto object-contain" />
            </Link>
            {isOrderMode && table && (
              <div className="flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="w-4 h-4" />
                <span>
                  {zoneNames[table.zone]}, стол {table.id}
                </span>
              </div>
            )}
            {!isOrderMode && <h1 className="font-serif text-xl">Меню</h1>}
            <Link
              href={user ? "/profile" : "/auth-user"}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{user ? `${user.points} ₽` : "Войти"}</span>
            </Link>
          </div>

          {/* Desktop categories */}
          <div className="mt-4 hidden md:flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-foreground text-background shadow-md"
                    : "bg-surface text-muted hover:text-foreground border border-border"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Mobile category selector */}
          <div className="mt-4 md:hidden">
            <button
              data-testid="category-selector"
              onClick={() => setShowCategorySheet(true)}
              className="w-full flex items-center justify-between rounded-xl bg-surface border border-border px-4 py-3 text-left active:bg-background-alt"
            >
              <span className="font-medium">
                {categories.find((c) => c.id === activeCategory)?.name || "Выберите категорию"}
              </span>
              <ChevronDown className="w-5 h-5 text-muted" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {categories
          .filter((cat) => !activeCategory || cat.id === activeCategory)
          .map((category) => (
            <section key={category.id} className="mb-10">
              <h2 className="font-serif text-2xl mb-5">{category.name}</h2>
              <div className="space-y-4">
                {category.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="group flex flex-col sm:flex-row gap-4 rounded-2xl bg-surface p-4 shadow-sm border border-border-light hover:shadow-md transition-all"
                  >
                    <div className="relative w-full h-40 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-background-alt">
                      {dish.image ? (
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 112px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted/50 text-xs text-center px-2">
                          Нет фото
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="font-serif text-lg sm:text-xl">{dish.name}</h3>
                      {dish.description && (
                        <p className="text-sm text-muted line-clamp-2 mt-1">{dish.description}</p>
                      )}
                      {dish.weight && (
                        <p className="text-xs text-muted/70 mt-auto pt-2">{dish.weight}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between gap-4">
                        <span className="font-semibold text-xl">{dish.price} ₽</span>
                        <button
                          onClick={() => addToCart(dish)}
                          className="rounded-full bg-accent px-6 py-2.5 text-base text-white font-medium hover:bg-accent-dark active:scale-95 transition-all min-h-[44px] min-w-[100px]"
                        >
                          В корзину
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
      </main>

      {totalCount > 0 && (
        <button
          onClick={openCart}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-foreground text-white px-6 py-3.5 shadow-xl hover:scale-105 transition-transform"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-medium">{totalCount} позиций</span>
          <span className="w-px h-4 bg-surface/30" />
          <span className="font-semibold">{total} ₽</span>
        </button>
      )}

      {/* Category bottom sheet (mobile) */}
      {showCategorySheet && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setShowCategorySheet(false)}
          />
          <div data-testid="category-sheet" className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col md:hidden">
            <div className="p-4 border-b border-border-light flex items-center justify-between">
              <h2 className="font-serif text-2xl">Категории</h2>
              <button
                onClick={() => setShowCategorySheet(false)}
                className="w-10 h-10 rounded-full bg-background-alt flex items-center justify-center text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  data-testid={`category-option-${category.name}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setShowCategorySheet(false);
                  }}
                  className={`w-full text-left rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-foreground text-white"
                      : "bg-surface text-foreground border border-border hover:bg-background-alt"
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-sm opacity-60">{category.dishes.length} блюд</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {showCart && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border-light flex items-center justify-between">
              <h2 className="font-serif text-2xl">{isOrderMode ? "Ваш заказ" : "Ваша корзина"}</h2>
              <button
                onClick={() => setShowCart(false)}
                className="w-10 h-10 rounded-full bg-background-alt flex items-center justify-center text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {cart.length === 0 ? (
                <p className="text-center text-muted py-8">Корзина пуста</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.dish.id} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-background-alt shrink-0">
                        {item.dish.image ? (
                          <Image
                            src={item.dish.image}
                            alt={item.dish.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted/50 text-xs">
                            Нет фото
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.dish.name}</p>
                        <p className="text-sm text-muted">{item.dish.price} ₽</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.dish, -1)}
                          className="w-8 h-8 rounded-full bg-background-alt flex items-center justify-center hover:bg-border"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.dish, 1)}
                          className="w-8 h-8 rounded-full bg-background-alt flex items-center justify-center hover:bg-border"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <textarea
                  placeholder="Комментарий к заказу"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-accent resize-none bg-background"
                  rows={2}
                />
              </div>
            </div>

            <div className="p-4 border-t border-border-light bg-background">
              {isOrderMode ? (
                <>
                  {user && maxPointsSpend > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-muted mb-1.5">
                        Списать баллов (доступно: {user.points})
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={maxPointsSpend}
                        value={pointsToSpend}
                        onChange={(e) => setPointsToSpend(Math.max(0, Math.min(maxPointsSpend, Number(e.target.value))))}
                        className="w-full rounded-xl border border-border px-4 py-2 outline-none focus:border-accent bg-background"
                      />
                      <p className="text-xs text-muted mt-1">Максимум {maxPointsSpend} ₽</p>
                    </div>
                  )}
                  {pointsToSpend > 0 && (
                    <div className="flex items-center justify-between mb-2 text-green-700">
                      <span>Скидка баллами</span>
                      <span>-{pointsToSpend} ₽</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted">Итого</span>
                    <span className="font-serif text-2xl">{finalTotal} ₽</span>
                  </div>
                  <button
                    onClick={sendOrder}
                    disabled={cart.length === 0}
                    className="w-full rounded-full bg-accent px-8 py-4 text-white font-medium hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Отправить заказ
                  </button>
                </>
              ) : user ? (
                <div className="text-center py-2">
                  <p className="text-muted mb-4">Оформление доставки и самовывоза скоро появится.</p>
                  <button
                    disabled
                    className="w-full rounded-full bg-accent px-8 py-4 text-white font-medium opacity-50 cursor-not-allowed"
                  >
                    Заказать доставку
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-muted mb-4">Для оформления доставки войдите в личный кабинет.</p>
                  <button
                    onClick={() => router.push("/auth-user?returnUrl=/menu")}
                    className="w-full rounded-full bg-accent px-8 py-4 text-white font-medium hover:bg-accent-dark transition-colors"
                  >
                    Войти или зарегистрироваться
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
