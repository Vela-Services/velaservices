import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

interface DeleteConfirmModalProps {
  deletingAccount: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  deletingAccount,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.25)" }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/20">
        <button
          className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-800"
          onClick={onCancel}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoCloseCircleOutline size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Delete Account</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete your account? This action cannot be undone.
            All your data, including profile information, bookings, and payment details
            will be permanently removed.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={deletingAccount}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deletingAccount}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deletingAccount ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

