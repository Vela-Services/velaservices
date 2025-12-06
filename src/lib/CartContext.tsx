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
import { CartItem, AppliedPromoCode } from "@/types/types";

import { toast } from "react-hot-toast";
import { removePendingSlot } from "../app/hooks/usePendingSlots";

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  appliedPromoCode: AppliedPromoCode | null;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState<AppliedPromoCode | null>(null);

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
    setAppliedPromoCode(null); // Clear promo code when cart is cleared
  };

  const applyPromoCode = async (code: string) => {
    if (!user) {
      toast.error("Please log in to use promo codes");
      return;
    }

    if (!code || code.trim() === "") {
      toast.error("Please enter a promo code");
      return;
    }

    // Calculate cart total
    const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          userId: user.uid,
          cartTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Invalid promo code");
        return;
      }

      if (data.valid && data.promoCode) {
        setAppliedPromoCode(data.promoCode);
        toast.success(`Promo code "${data.promoCode.code}" applied!`);
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      toast.error("Failed to apply promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
    toast.success("Promo code removed");
  };

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart,
        appliedPromoCode,
        applyPromoCode,
        removePromoCode,
      }}
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
