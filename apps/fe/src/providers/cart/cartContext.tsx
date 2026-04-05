import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Size } from "../../types/enums/size";
import client from "../../api/client";

interface CartItem {
  productId: number;
  quantity: number;
  selectedSize: Size;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  clearCart: () => void;
  placeOrder: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = localStorage.getItem("cartItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => [...prevItems, item]);
    alert("Item added to cart!");
  };

  const removeItem = (item: CartItem) => {
    setItems((prevItems) =>
      prevItems.filter(
        (i) =>
          i.productId !== item.productId ||
          i.selectedSize !== item.selectedSize ||
          i.quantity !== item.quantity,
      ),
    );
    alert("Item removed from cart!");
  };
  const clearCart = () => {
    setItems([]);
    alert("Cart cleared!");
  };

  const placeOrder = async () => {
    const { error } = await client.post("/orders", items);

    if (error) {
      throw new Error(error);
    }
    alert("Order placed successfully!");
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, placeOrder }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider as AuthProvider };
