"use client";

import { useState } from "react";
import { useCart } from "../../lib/CartContext";

export default function PaymentPage() {
  const { cart, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calcul simple du total (ex: 50€ par service)
  const totalPrice = cart.length * 50;

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simule traitement paiement
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] text-[#7C5E3C]">
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
          <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
          <p className="mb-2">Add services before proceeding to payment.</p>
          <a
            href="/home"
            className="mt-2 px-6 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E8D3] to-[#fcf5eb] flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#BFA181] rounded-full p-4 shadow-lg mb-3">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <rect
                x="2"
                y="7"
                width="20"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
              />
              <path
                d="M2 10h20"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-[#7C5E3C] mb-1 tracking-tight">
            Payment
          </h1>
          <p className="text-[#7C5E3C]/70 text-lg">Secure checkout</p>
        </div>

        {success ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center text-[#7C5E3C] flex flex-col items-center animate-fade-in">
            <svg
              className="w-16 h-16 mb-4 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">Payment Successful!</h2>
            <p className="mb-4">Thank you for your purchase.</p>
            <a
              href="/home"
              className="inline-block px-6 py-2 rounded-full bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
            >
              Back to Home
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <section className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between">
              <div>
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
                  Order Summary
                </h2>
                <ul className="divide-y divide-gray-200 max-h-48 overflow-y-auto mb-4">
                  {cart.map((item, i) => (
                    <li
                      key={i}
                      className="py-3 flex justify-between items-center text-[#7C5E3C]"
                    >
                      <div>
                        <div className="font-medium text-base">{item.serviceName}</div>
                        <div className="text-sm text-gray-400">
                          {item.date} at {item.time}
                        </div>
                      </div>
                      <div className="font-semibold text-[#BFA181]">50€</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-4 mt-2 flex justify-between items-center">
                <span className="font-semibold text-[#7C5E3C] text-lg">Total:</span>
                <span className="font-bold text-2xl text-[#BFA181]">{totalPrice}€</span>
              </div>
            </section>

            {/* Payment Form */}
            <form
              onSubmit={handlePayment}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-7 text-[#7C5E3C] flex flex-col justify-between"
              autoComplete="off"
            >
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-[#BFA181]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="2"
                      y="7"
                      width="20"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth={2}
                      fill="none"
                    />
                    <path
                      d="M2 10h20"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </svg>
                  Payment Details
                </h2>

                <div className="mb-4">
                  <label htmlFor="cardNumber" className="block mb-1 font-medium">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    onChange={handleChange}
                    value={formData.cardNumber}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                    inputMode="numeric"
                    pattern="[0-9\s]{13,19}"
                  />
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="expiryDate" className="block mb-1 font-medium">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      maxLength={5}
                      onChange={handleChange}
                      value={formData.expiryDate}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                      inputMode="numeric"
                      pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cvc" className="block mb-1 font-medium">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cvc"
                      name="cvc"
                      placeholder="123"
                      maxLength={4}
                      onChange={handleChange}
                      value={formData.cvc}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                      inputMode="numeric"
                      pattern="[0-9]{3,4}"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    onChange={handleChange}
                    value={formData.name}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#BFA181] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className={`w-full py-3 rounded-full font-bold text-lg shadow-md transition 
                  ${
                    processing
                      ? "bg-[#BFA181]/60 text-white cursor-not-allowed"
                      : "bg-[#BFA181] text-white hover:bg-[#A68A64]"
                  }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ${totalPrice}€`
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
