import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

type CartItem = {
  serviceName: string;
  date: string;
  time: string;
};

export async function createMissionsFromCart(
  cart: CartItem[],
  customerId: string
) {
  const missionsRef = collection(db, "missions");

  const promises = cart.map((item) =>
    addDoc(missionsRef, {
      userId: customerId,
      serviceName: item.serviceName,
      date: item.date,
      time: item.time,
      createdAt: Timestamp.now(),
      status: "pending",
      providerId: null, // À attribuer plus tard
    })
  );

  await Promise.all(promises);
}
