// src/store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  cart_id?: number;
  id: number;
  title: string;
  slug: string;
  newPrice: number;
  weight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  oldPrice: any;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
}

export interface CounterState {
  items: Item[];
  orders: object[];
}

// Default items
const defaultItems: Item[] = [
  // your default items here...
];

// Default orders
const defaultOrders: object[] = [
  // your default orders here...
];

// Initialize cart items from localStorage or fallback to default
const getInitialCartItems = (): Item[] => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("products");
  }
  return [];
};

// Initial state
const initialState: CounterState = {
  items: getInitialCartItems(),
  orders: defaultOrders,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("products", JSON.stringify(state.items));
      }
    },
    addItem(state, action: PayloadAction<Item>) {
      const existing = state.items.find(
        (item) => item.cart_id === action.payload.cart_id,
      );

      if (existing) {
        existing.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("products", JSON.stringify(state.items));
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);

      if (typeof window !== "undefined") {
        localStorage.setItem("products", JSON.stringify(state.items));
      }
    },
    clearCart(state) {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.setItem("products", JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, action) => {
      const { cart_id, quantity } = action.payload;

      const item = state.items.find((i) => i.cart_id === cart_id);

      if (item) {
        item.quantity = quantity;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("products", JSON.stringify(state.items));
      }
    },
    addOrder(state, action: PayloadAction<any>) {
      const newOrder = action.payload;

      // সবসময় Redux state এ add করো
      state.orders = [...state.orders, newOrder];

      // localStorage এ save করো (guest + logged-in উভয়ের জন্য)
      if (typeof window !== "undefined") {
        const loginUser = JSON.parse(
          localStorage.getItem("login_user") || "{}",
        );

        if (loginUser?.uid) {
          // Logged-in user — uid অনুযায়ী store
          const storedOrders = JSON.parse(
            localStorage.getItem("orders") || "{}",
          );
          const userOrders = storedOrders[loginUser.uid] || [];
          storedOrders[loginUser.uid] = [...userOrders, newOrder];
          localStorage.setItem("orders", JSON.stringify(storedOrders));
        } else {
          // Guest user — সরাসরি array হিসেবে store
          const guestOrders = JSON.parse(
            localStorage.getItem("guest_orders") || "[]",
          );
          localStorage.setItem(
            "guest_orders",
            JSON.stringify([...guestOrders, newOrder]),
          );
        }
      }
    },
    setOrders(state, action: PayloadAction<any[]>) {
      state.orders = action.payload;
    },
  },
});

export const {
  setItems,
  addItem,
  removeItem,
  clearCart,
  updateQuantity,
  addOrder,
  setOrders,
} = cartSlice.actions;

export default cartSlice.reducer;
