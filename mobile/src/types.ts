export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  dishes: Dish[];
}

export interface Dish {
  id: number;
  name: string;
  description: string | null;
  price: number;
  weight: string | null;
  image: string | null;
  categoryId: number;
  isActive: boolean;
  isStopListed: boolean;
}

export interface Table {
  id: number;
  zone: "HALL1" | "HALL2" | "TERRACE";
  seats: number;
  isActive: boolean;
}

export interface Reservation {
  id: number;
  tableId: number;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  comment: string | null;
  status: string;
  table: Table;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}
