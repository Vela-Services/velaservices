"use client";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({ open, onClose, onConfirm }: ConfirmModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#7C5E3C] mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-[#BFA181]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          Confirm Mission Acceptance
        </h3>
        <p className="text-[#7C5E3C] mb-4">
          Are you sure you want to accept this mission? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-[#7C5E3C] font-semibold hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#BFA181] text-white font-semibold hover:bg-[#A68A64] transition"
            onClick={onConfirm}
          >
            Yes, Accept
          </button>
        </div>
      </div>
    </div>
  );
}

