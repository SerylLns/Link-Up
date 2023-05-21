import React, { FormEvent, useContext, useState } from "react";
import Card from "./Card";
import Avatar from "./Avatar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserContext } from "@/contexts/userContext";
import { photoUrl } from "@/helpers/photoHelpers";
import { CircleLoader } from "react-spinners";
import Image from "next/image";

export type ProfileType = {
  id: Number;
  avatar: string;
  name: string;
  created_at: string;
};

const PostFormCard = ({ onPost }: { onPost: () => void }) => {
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<Array<string | void>>([]);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = useSupabaseClient();
  const session = useSession();
  const { profile } = useContext(UserContext);

  const createPost = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = { content, author: session?.user.id, photos };
    supabase
      .from("posts")
      .insert(data)
      .then((res) => {
        if (!res.error) {
          setContent("");
          setPhotos([]);
          onPost();
        }
      });
  };

  const addPhotos = (event: FormEvent<HTMLInputElement>) => {
    // if (event.target?.files) return;
    const files = event.currentTarget.files;
    if (files) {
      setIsUploading(true);
      Object.keys(files).forEach((key: any) => {
        const name = Date.now() + files[key].name;
        supabase.storage
          .from("photos")
          .upload(name, files[key])
          .then((result) => {
            setPhotos([...photos, result.data?.path]);
            setIsUploading(false);
          })
          .catch((err) => console.log(err));
      });
    }
  };

  return (
    <Card>
      <div className="flex gap-2">
        <div>
          <Avatar url={profile?.avatar} />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="grow p-3 h-16 bg-neutral outline-none rounded-xl focus:shadow-md"
          placeholder={`Qu'est-ce que vous avez en tête ${profile?.name} ?`}
        />
      </div>
      {isUploading && (
        <div className="py-4 px-2 w-6">
          <CircleLoader speedMultiplier={1} color={"#ff4500"} />
        </div>
      )}
      {photos.length > 0 && (
        <div className="flex gap-2">
          {photos.map((photo, i) => (
            <div className="mt-2" key={i}>
              <img
                src={photoUrl(photo)}
                alt=""
                className="w-auto h-24 rounded-md"
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-5 items-center mt-2">
        <div>
          <label className="flex gap-1 hover:text-complementaryLight cursor-pointer transition   duration-400 hover:shadow-lg hover:bg-neutral p-2 rounded">
            <input
              type="file"
              className="hidden"
              multiple
              onChange={addPhotos}
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
            <span className="hidden md:block text-happy-monkey">Photos</span>
          </label>
        </div>
        <div className="opacity-20">
          <button className="flex gap-1 cursor-not-allowed">
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <span className="hidden md:block text-happy-monkey">Mes amis</span>
          </button>
        </div>
        <div className="opacity-20">
          <button className="flex gap-1 cursor-not-allowed">
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
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <span className="hidden md:block text-happy-monkey">
              Localisation
            </span>
          </button>
        </div>
        <div className="opacity-20">
          <button className="flex gap-1 cursor-not-allowed">
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
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
            <span className="hidden md:block text-happy-monkey">Mood</span>
          </button>
        </div>
        <div className="grow text-right">
          <button
            onClick={createPost}
            className="bg-primary opacity-80 hover:opacity-100 hover:scale-110 transition-all text-white px-6 py-1 rounded-md"
          >
            Partager
          </button>
        </div>
      </div>
    </Card>
  );
};
export default PostFormCard;
