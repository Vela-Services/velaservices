import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { CartItem } from "../types/types";



export async function createMissionsFromCart(
  cart: CartItem[],
  customerId: string,
  customerName: string
) {
  const missionsRef = collection(db, "missions");

  const promises = cart.map((item) =>
    addDoc(missionsRef, {
      userId: customerId,
      userName: customerName,
      serviceName: item.serviceName,
      date: item.date,
      time: item.time,
      price: item.price,
      createdAt: Timestamp.now(),
      status: "pending",
      providerId: null, // À attribuer plus tard
    })
  );

  await Promise.all(promises);
}
