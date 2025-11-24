import React from "react";
import { User } from "firebase/auth";
import { UserProfile } from "@/types/types";
import { IoSettingsSharp } from "react-icons/io5";
import { MdOutlineVerified, MdPhotoCamera } from "react-icons/md";

interface ProfileHeaderProps {
  user: User;
  profile: UserProfile | null;
  onSettingsClick: () => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileHeader({
  user,
  profile,
  onSettingsClick,
  onPhotoChange,
}: ProfileHeaderProps) {
  return (
    <div
      className="h-32 relative"
      style={{
        background:
          "linear-gradient(135deg, #3d676d 0%, #527278 50%, #6b8388 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

      {/* Settings Button */}
      <button
        onClick={onSettingsClick}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-105"
      >
        <IoSettingsSharp size={18} />
      </button>

      {/* Profile Picture */}
      <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
        <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-2xl relative group flex items-center justify-center ring-4 ring-white/50">
          <img
            src={
              user.photoURL ||
              profile?.photoURL ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
          {/* Change Picture Button */}
          <label
            htmlFor="profilePicture"
            className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-br from-[#3d676d] to-[#527278] rounded-full flex items-center justify-center border-2 border-white cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-10"
            title="Change profile picture"
          >
            <MdPhotoCamera size={16} className="text-white" />
            <input
              type="file"
              id="profilePicture"
              onChange={onPhotoChange}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        {user.emailVerified && (
          <div className="absolute -bottom-2 -left-2 w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-10">
            <MdOutlineVerified size={16} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

