import React from "react";
import { UserProfile } from "@/types/types";
import { MdEdit } from "react-icons/md";

interface ProfileBioProps {
  profile: UserProfile | null;
  editingBio: boolean;
  bioValue: string;
  savingBio: boolean;
  bioError: string | null;
  onEditBio: () => void;
  onBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBioSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProfileBio({
  profile,
  editingBio,
  bioValue,
  savingBio,
  bioError,
  onEditBio,
  onBioChange,
  onBioSave,
  onCancel,
}: ProfileBioProps) {
  if (editingBio) {
    return (
      <div className="mb-6 px-2">
        <form onSubmit={onBioSave}>
          <textarea
            name="why"
            value={bioValue}
            onChange={onBioChange}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all mb-2"
            placeholder="This is your short bio. Write 2–3 sentences to describe yourself."
            disabled={savingBio}
          />
          {bioError && (
            <div className="bg-red-50 text-red-600 p-2 rounded-xl mb-2 text-sm">
              {bioError}
            </div>
          )}
          <div className="flex space-x-2 justify-end">
            <button
              type="submit"
              disabled={savingBio}
              className="text-white py-2 px-4 rounded-xl font-medium disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              style={{
                background:
                  "linear-gradient(135deg, #3d676d 0%, #527278 100%)",
              }}
            >
              {savingBio ? "Saving..." : "Save Bio"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={savingBio}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <p className="text-gray-700 text-sm leading-relaxed flex-1">
            {profile?.why ? (
              <span className="italic">&ldquo;{profile.why}&rdquo;</span>
            ) : (
              <span className="text-gray-500">
                This is your short bio. Write 2–3 sentences to describe yourself.
              </span>
            )}
          </p>
          <button
            onClick={onEditBio}
            className="flex items-center gap-1 text-xs text-[#3d676d] hover:text-[#527278] transition-colors flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/60"
            title="Edit bio"
          >
            <MdEdit size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

