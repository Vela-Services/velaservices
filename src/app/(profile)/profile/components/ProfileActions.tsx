import React from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

interface ProfileActionsProps {
  onEdit: () => void;
}

export function ProfileActions({ onEdit }: ProfileActionsProps) {
  return (
    <div className="flex space-x-3 mb-4">
      <button
        onClick={onEdit}
        className="flex-1 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #3d676d 0%, #527278 100%)",
        }}
      >
        <MdEdit size={18} />
        <span>Edit Profile</span>
      </button>
      <button
        onClick={() => alert("Share profile coming soon!")}
        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200"
      >
        <IoShareSocialOutline size={18} />
      </button>
    </div>
  );
}

