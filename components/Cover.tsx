import { photoUrl } from "@/helpers/photoHelpers";
import { uploadUserProfileImage } from "@/helpers/userHelpers";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { BeatLoader, CircleLoader } from "react-spinners";

const Cover = ({
  url,
  editable,
  onChange,
}: {
  url: string;
  editable: boolean;
  onChange: () => void;
}) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isUploading, setIsUploading] = useState(false);

  const updateCover = async (event: FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file && session?.user) {
      setIsUploading(true);
      await uploadUserProfileImage(supabase, session?.user.id, file, "cover");
      setIsUploading(false);
      onChange();
    }
  };
  if (isUploading)
    return (
      <div className="h-36 overflow-hidden flex relative justify-center items-center">
        <CircleLoader color="#ff4500" />
      </div>
    );
  return (
    <div className="h-36 overflow-hidden flex relative justify-center items-center">
      <div>
        <img src={url} alt="profile cover image" />
      </div>
      {editable && (
        <div className="absolute right-4 bottom-5">
          <label
            htmlFor="cover"
            className="bg-primary cursor-pointer shadow-md shadow-black rounded-full block p-2 text-neutral opacity-70 hover:opacity-100"
          >
            <input
              type="file"
              name="cover"
              id="cover"
              className="hidden"
              onChange={updateCover}
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
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </label>
        </div>
      )}
    </div>
  );
};

export default Cover;
