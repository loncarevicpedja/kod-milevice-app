"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartAddon = {
  id: number;
  name: string;
  price: number;
};

export type CartItem = {
  id: string;
  productId: number;
  name: string;
  note?: string;
  basePrice: number;
  quantity: number;
  isClassic: boolean;
  addons: CartAddon[];
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const addonsTotal = item.addons.reduce(
        (addonSum, addon) => addonSum + addon.price,
        0,
      );
      return sum + (item.basePrice + addonsTotal) * item.quantity;
    }, 0);

    return {
      items,
      totalItems,
      totalPrice,
      addItem: (itemInput) => {
        setItems((current) => {
          const addonsKey =
            itemInput.addons
              .map((a) => `${a.id}-${a.price}`)
              .sort()
              .join("|") || "none";
          const key = `${itemInput.productId}-${addonsKey}-${itemInput.note || ""}`;

          const existingIndex = current.findIndex((it) => it.id === key);
          if (existingIndex !== -1) {
            const copy = [...current];
            copy[existingIndex] = {
              ...copy[existingIndex],
              quantity: copy[existingIndex].quantity + 1,
            };
            return copy;
          }

          const newItem: CartItem = {
            ...itemInput,
            id: key,
            quantity: 1,
          };
          return [...current, newItem];
        });
      },
      updateQuantity: (id, quantity) => {
        setItems((current) =>
          current
            .map((item) =>
              item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem: (id) => {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      clearCart: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

