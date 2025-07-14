"use client";

import React, { useState } from "react";
import { useCart } from "../../lib/CartContext";

const services = [
  { id: "cleaning", name: "Cleaning" },
  { id: "babysitting", name: "Babysitting" },
  { id: "petsitting", name: "Pet Sitting" },
  { id: "cooking", name: "Cooking" },
];

export default function HomePage() {
  const [openService, setOpenService] = useState<string | null>(null);
  const [dateByService, setDateByService] = useState<Record<string, string>>(
    {}
  );
  const [timeByService, setTimeByService] = useState<Record<string, string>>(
    {}
  );

  const { addToCart } = useCart();

  const toggleService = (id: string) => {
    setOpenService(openService === id ? null : id);
  };

  const handleAddToCart = (serviceId: string, serviceName: string) => {
    const date = dateByService[serviceId] || "";
    const time = timeByService[serviceId] || "";
    if (!date || !time) {
      alert("Please choose a date and time");
      return;
    }

    addToCart({ serviceId, serviceName, date, time });
    alert("Service added to cart!");
  };

  return (
    <div className="min-h-screen bg-[#F5E8D3] py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-[#7C5E3C] mb-10">
        Choose a Service
      </h1>

      <div className="max-w-3xl mx-auto grid gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-md p-6">
            <button
              onClick={() => toggleService(service.id)}
              className="w-full text-left flex justify-between items-center"
            >
              <span className="text-xl font-semibold text-[#7C5E3C]">
                {service.name}
              </span>
              <span className="text-[#BFA181] font-bold text-xl">
                {openService === service.id ? "−" : "+"}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openService === service.id ? "max-h-[300px] mt-4" : "max-h-0"
              }`}
            >
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-[#7C5E3C]">
                  Choose a date:
                </label>
                <input
                  type="date"
                  value={dateByService[service.id] || ""}
                  onChange={(e) =>
                    setDateByService((prev) => ({
                      ...prev,
                      [service.id]: e.target.value,
                    }))
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
                />

                <label className="block text-sm font-medium text-[#7C5E3C]">
                  Choose a time:
                </label>
                <input
                  type="time"
                  value={timeByService[service.id] || ""}
                  onChange={(e) =>
                    setTimeByService((prev) => ({
                      ...prev,
                      [service.id]: e.target.value,
                    }))
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFA181]"
                />

                <button
                  className="mt-4 w-full bg-[#BFA181] text-white py-2 rounded-md hover:bg-[#A68A64] transition"
                  onClick={() => handleAddToCart(service.id, service.name)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
