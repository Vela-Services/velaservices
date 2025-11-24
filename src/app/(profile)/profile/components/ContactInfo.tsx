import React from "react";
import { User } from "firebase/auth";
import { UserProfile } from "@/types/types";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";

interface ContactInfoProps {
  user: User;
  profile: UserProfile | null;
  resendingEmail: boolean;
  emailResent: boolean;
  onResendVerificationEmail: () => void;
}

export function ContactInfo({
  user,
  profile,
  resendingEmail,
  emailResent,
  onResendVerificationEmail,
}: ContactInfoProps) {
  return (
    <div className="space-y-3 mb-6">
      {/* Email Verification Alert */}
      {user && !user.emailVerified && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <IoAlertCircleOutline
                  size={18}
                  className="text-yellow-600"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                  Verify Your Email
                </h4>
                <p className="text-xs text-yellow-700 mb-3">
                  Please check your inbox and click the verification link. If you
                  didn&apos;t receive the email, click the button below to resend it.
                </p>
                <button
                  onClick={onResendVerificationEmail}
                  disabled={resendingEmail}
                  className="text-sm px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
                >
                  {resendingEmail
                    ? "Sending..."
                    : emailResent
                    ? "✓ Email Sent!"
                    : "Resend Verification Email"}
                </button>
                {emailResent && (
                  <p className="text-xs text-green-700 mt-2 font-medium">
                    ✓ Verification email sent! Please check your inbox.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email */}
      <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-sm">
            <IoMailOutline size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-800 text-sm font-medium truncate">{user.email}</span>
              {user.emailVerified && (
                <MdOutlineVerified
                  size={18}
                  className="text-green-600 flex-shrink-0"
                  title="Email verified"
                />
              )}
            </div>
            {!user.emailVerified && (
              <div className="flex items-center mt-1">
                <IoAlertCircleOutline
                  size={14}
                  className="text-yellow-600 mr-1"
                />
                <span className="text-xs text-yellow-600">Email not verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phone */}
      {profile?.phone && (
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-sm">
            <IoCallOutline size={18} className="text-white" />
          </div>
          <span className="text-gray-800 text-sm font-medium">{profile.phone}</span>
        </div>
      )}

      {/* Address */}
      {profile?.address && (
        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-sm">
            <IoLocationOutline size={18} className="text-white" />
          </div>
          <span className="text-gray-800 text-sm font-medium">{profile.address}</span>
        </div>
      )}
    </div>
  );
}

