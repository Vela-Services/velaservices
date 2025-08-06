"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth"; // custom hook pour l'utilisateur connecté
import { CartItem } from "@/types/types";


type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");
    const q = query(cartRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCart(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CartItem))
      );
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (item: Omit<CartItem, "id">) => {
    if (!user) return;
    const cartRef = collection(db, "users", user.uid, "cart");
    await addDoc(cartRef, { ...item, createdAt: new Date() });
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "cart", itemId));
  };

  const clearCart = async () => {
    if (!user) return;
    const cartRef = collection(db, "users", user.uid, "cart");
    const q = query(cartRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
