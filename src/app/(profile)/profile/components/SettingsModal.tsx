import React from "react";

interface SettingsModalProps {
  onClose: () => void;
  onDeleteAccount: () => void;
}

export function SettingsModal({ onClose, onDeleteAccount }: SettingsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.25)" }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/20">
        <button
          className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-6 text-gray-800">Account Settings</h3>
        <ul className="space-y-4">
          <li>
            <a
              href="/password"
              className="block py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: "#3d676d" }}
            >
              Change Password
            </a>
          </li>
          <li>
            <a
              href="/privacy"
              className="block py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: "#3d676d" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="/contact"
              className="block py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: "#3d676d" }}
            >
              Delete Data
            </a>
          </li>
          <li>
            <button
              onClick={() => {
                onClose();
                onDeleteAccount();
              }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
            >
              Delete Account
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

