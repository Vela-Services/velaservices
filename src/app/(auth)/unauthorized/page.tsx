"use client";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5E8D3] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <FaExclamationTriangle className="h-16 w-16 text-[#BFA181] mb-4" />
        <h1 className="text-3xl font-bold text-[#A68A64] mb-2">Access Restricted</h1>
        <p className="text-gray-700 mb-4 text-center">
          You do not have permission to view this page.<br />
          This area is only accessible to specific user roles.
        </p>
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/"
            className="inline-block w-full text-center px-6 py-2 bg-[#BFA181] text-white rounded-full font-semibold shadow hover:bg-[#7C5E3C] transition"
          >
            Go to Home
          </Link>
          <Link
            href="/login"
            className="inline-block w-full text-center px-6 py-2 bg-[#A68A64] text-white rounded-full font-semibold shadow hover:bg-[#7C5E3C] transition"
          >
            Log in with a different account
          </Link>
        </div>
        <div className="mt-6 text-sm text-[#7C5E3C] text-center">
          If you believe this is a mistake, please contact support or check your account role.<br />
          <span className="italic">Providers and customers have different access areas.</span>
        </div>
      </div>
    </div>
  );
}
