"use client";

import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import { FaTrashAlt, FaCalendarAlt, FaClock, FaUser, FaBuilding } from "react-icons/fa";

function formatTimes(times: string[] | string) {
  if (Array.isArray(times)) return times.join(", ");
  return times;
}

function formatSubservices(subservices: Record<string, number> | undefined) {
  if (!subservices || Object.keys(subservices).length === 0) return null;
  return (
    <div className="mt-1 text-xs text-[#7C5E3C]/80">
      <span className="font-semibold">Subservices:</span>{" "}
      {Object.entries(subservices)
        .map(([name, hours]) => `${name} (${hours}h)`)
        .join(", ")}
    </div>
  );
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  console.log(cart, "cart");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#BFA181] rounded-full p-4 shadow-lg mb-3">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-7 9 7M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-[#7C5E3C] mb-1 tracking-tight">
            Your Cart
          </h1>
          <p className="text-[#7C5E3C]/70 text-lg text-center max-w-md">
            Here you can review your selected services, their details, and make changes before proceeding to payment.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/80 rounded-2xl shadow-lg p-10 flex flex-col items-center">
            <svg
              className="w-16 h-16 mb-4 text-[#BFA181]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-7 9 7M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6"
              />
            </svg>
            <h2 className="text-2xl font-semibold mb-2 text-[#7C5E3C]">
              Your cart is empty
            </h2>
            <p className="mb-4 text-[#7C5E3C]/80 text-center">
              Add services to your cart before proceeding to payment.
            </p>
            <Link
              href="/customer/services"
              className="mt-2 px-6 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
            >
              Back to the services
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-semibold mb-4 text-[#7C5E3C] flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-[#BFA181]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 16v-4"
                  />
                </svg>
                Cart Summary
              </h2>
              <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-[#7C5E3C] group transition hover:bg-[#fcf5eb]/60 rounded-xl px-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base flex items-center gap-2">
                        <span className="truncate">{item.serviceName}</span>
                        <span className="ml-2 px-2 py-0.5 rounded bg-[#F5E8D3] text-xs font-medium text-[#BFA181]">
                          {item.providerName}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="inline-block mr-1" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="inline-block mr-1" />
                          {formatTimes(item.times)}
                        </span>
                        {item.providerEmail && (
                          <span className="flex items-center gap-1">
                            <FaUser className="inline-block mr-1" />
                            <span className="truncate max-w-[120px]">{item.providerEmail}</span>
                          </span>
                        )}
                      </div>
                      {formatSubservices(item.subservices)}
                    </div>
                    <div className="flex items-center gap-4 mt-3 sm:mt-0 sm:ml-4">
                      <span className="font-semibold text-[#BFA181] text-lg whitespace-nowrap">
                        {item.price} NOK
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-full hover:bg-red-100 transition"
                        title="Remove"
                        aria-label="Remove"
                      >
                        <FaTrashAlt className="text-red-600 group-hover:scale-110 transition" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4 mt-2 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span className="font-semibold text-[#7C5E3C] text-lg">
                  Total:
                </span>
                <span className="font-bold text-2xl text-[#BFA181]">
                  {totalPrice} NOK
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={clearCart}
                  className="w-full sm:w-1/2 bg-[#BFA181] text-white py-3 rounded-full font-semibold hover:bg-[#A68A64] transition shadow"
                >
                  Clear Cart
                </button>
                <Link
                  href="/payment"
                  className="w-full sm:w-1/2 bg-[#7C5E3C] text-white py-3 rounded-full text-center font-semibold hover:bg-[#5a452a] transition shadow"
                >
                  Proceed to Payment
                </Link>
              </div>
              <div className="mt-6 text-xs text-[#7C5E3C]/70 text-center">
                <p>
                  <span className="font-semibold">Tip:</span> You can remove individual services or clear your entire cart before payment.
                </p>
                <p className="mt-1">
                  Need to add more services?{" "}
                  <Link
                    href="/customer/services"
                    className="underline hover:text-[#BFA181] transition"
                  >
                    Browse services
                  </Link>
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
