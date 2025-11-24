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
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <details className="group">
        <summary className="p-3 cursor-pointer hover:bg-gray-50/50 transition-all duration-200 list-none">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 text-xs">Account Details</span>
            <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform">▼</span>
          </div>
        </summary>
        <div className="px-3 pb-3 border-t border-gray-100 pt-3">
          <div className="space-y-2 text-xs">
            <div>
              <div className="space-y-1.5 text-gray-600 bg-gray-50 rounded-lg p-2.5">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">User ID:</span>
                  <span className="font-mono text-xs">{user.uid.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Email Verified:</span>
                  <span className={user.emailVerified ? "text-green-600 font-medium text-xs" : "text-yellow-600 font-medium text-xs"}>
                    {user.emailVerified ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Member Since:</span>
                  <span className="text-xs">
                    {user.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })
                      : "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs">Role:</span>
                  <span className="font-medium capitalize text-xs">{profile?.role || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

