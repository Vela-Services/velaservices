"use client";
// app/unauthorized/page.tsx
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <FaExclamationTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-[#BFA181] text-white rounded-full font-semibold shadow hover:bg-[#7C5E3C] transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
