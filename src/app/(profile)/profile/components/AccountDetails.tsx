import React from "react";
import { User } from "firebase/auth";
import { UserProfile } from "@/types/types";

interface AccountDetailsProps {
  user: User;
  profile: UserProfile | null;
  completion: number;
}

export function AccountDetails({
  user,
  profile,
  completion,
}: AccountDetailsProps) {
  return (
    <div className="mt-4 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <details className="group">
        {/* Stats/Completion */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Profile Completion
            </span>
            <span className="text-sm font-bold text-green-600">{completion}%</span>
          </div>
          <div className="w-full bg-green-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>
        <summary className="p-6 cursor-pointer hover:bg-white/40 transition-all duration-200">
          <span className="font-medium text-gray-800">Account Details</span>
        </summary>
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Account</h4>
              <div className="space-y-1 text-gray-600">
                <div>ID: {user.uid.substring(0, 8)}...</div>
                <div>Verified: {user.emailVerified ? "Yes" : "No"}</div>
                <div>
                  Member since:{" "}
                  {user.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "Unknown"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Settings</h4>
              <div className="space-y-1 text-gray-600">
                <div>Role: {profile?.role || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

