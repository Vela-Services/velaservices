import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { CartItem } from "../types/types";


export async function createMissionsFromCart(
  cart: CartItem[],
  customerId: string,
  displayName: string,
  address: string,
  phone: string,
) {
  const missionsRef = collection(db, "missions");

  const promises = cart.map((item) => {
    const safeSubservices = Object.fromEntries(
      Object.entries(item.subservices || {}).map(([k, v]) => [k, v ?? 0])
    );

    return addDoc(missionsRef, {
      userId: customerId,  // ✅ pour les règles
      userName: displayName,
      userAddress: address,
      userPhone: phone,
      serviceName: item.serviceName,
      date: item.date,
      times: item.times || [],
      price: item.price,
      createdAt: Timestamp.now(),
      status: "pending",
      providerId: item.providerId,
      subservices: safeSubservices,
    });
  });

  await Promise.all(promises);
}
