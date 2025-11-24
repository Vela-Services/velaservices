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
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <IoAlertCircleOutline
                size={20}
                className="text-yellow-600 mt-0.5 flex-shrink-0"
              />
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
                  className="text-sm px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {resendingEmail
                    ? "Sending..."
                    : emailResent
                    ? "✓ Email Sent!"
                    : "Resend Verification Email"}
                </button>
                {emailResent && (
                  <p className="text-xs text-green-700 mt-2">
                    Verification email sent! Please check your inbox.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email */}
      <div className="flex items-center p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <IoMailOutline size={16} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">{user.email}</span>
              {user.emailVerified && (
                <MdOutlineVerified
                  size={16}
                  className="text-green-600"
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
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <IoCallOutline size={16} className="text-green-600" />
          </div>
          <span className="text-gray-700 text-sm">{profile.phone}</span>
        </div>
      )}

      {/* Address */}
      {profile?.address && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <IoLocationOutline size={16} className="text-purple-600" />
          </div>
          <span className="text-gray-700 text-sm">{profile.address}</span>
        </div>
      )}
    </div>
  );
}

