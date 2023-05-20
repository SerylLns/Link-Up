import { uploadUserProfileImage } from "@/helpers/userHelpers";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import React, { FormEvent, useState } from "react";

export type AvatarProps = {
  size?: string;
  url: string;
  editable: boolean;
  onChange: () => void;
};

const Avatar = ({
  size,
  url,
  editable = false,
  onChange = () => {},
}: AvatarProps) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isUploading, setIsUploading] = useState(false);

  let width = "w-12";
  if (size === "lg") {
    width = "w-24 md:w-36";
  }

  const updateAvatar = async (event: FormEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (file && session?.user) {
      setIsUploading(true);
      await uploadUserProfileImage(supabase, session?.user.id, file, "avatar");
      setIsUploading(false);
      onChange();
    }
  };

  return (
    <div className={`${width} relative`}>
      <div className="rounded-full overflow-hidden relative w-full">
        <img src={url} alt="profile picture" className="w-full" />
      </div>
      {editable && (
        <div className="absolute right-0 bottom-2">
          <label
            htmlFor="avatar"
            className="bg-primary cursor-pointer hover:shadow-md shadow-black rounded-full block p-2 text-neutral opacity-70 hover:opacity-100"
          >
            <input
              type="file"
              name="avatar"
              id="avatar"
              className="hidden"
              onChange={updateAvatar}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </label>
        </div>
      )}
    </div>
  );
};

export default Avatar;
