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
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "../app/hooks/useAuth"; // custom hook pour l'utilisateur connecté
import { CartItem } from "@/types/types";

import { toast } from "react-hot-toast";
import { removePendingSlot } from "../app/hooks/usePendingSlots";

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
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as CartItem))
      );
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (item: Omit<CartItem, "id">) => {
    if (!user) return;
    const cartRef = collection(db, "users", user.uid, "cart");
    await addDoc(cartRef, { ...item, createdAt: new Date() });

    // Use a string message for toast.success to ensure it shows
    toast.success(`Added to cart: ${item.serviceName} on ${item.date}`);
  };

  const removeFromCart = async (itemId: string) => {
    console.log("🗑️ Trying to remove item with ID:", itemId);
    console.log("👤 User ID:", user?.uid);

    if (!user) return;

    if (!itemId || itemId.trim() === "") {
      console.error("❌ Invalid itemId:", itemId);
      toast.error("Invalid item ID");
      return;
    }

    try {
      const docPath = `users/${user.uid}/cart/${itemId}`;
      console.log("📄 Document path:", docPath);

      await deleteDoc(doc(db, "users", user.uid, "cart", itemId));
      toast.success("Item removed from cart");
      await removePendingSlot(itemId);
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    const cartRef = collection(db, "users", user.uid, "cart");
    const q = query(cartRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach((doc) => batch.delete(doc.ref));
    
    const pendingSlotsRef = collection(db, "pendingSlots");
    const pendingQuery = query(pendingSlotsRef, where("userId", "==", user.uid));
    const pendingSnapshot = await getDocs(pendingQuery);
    pendingSnapshot.forEach((doc) => batch.delete(doc.ref));
    
    await batch.commit();
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
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
