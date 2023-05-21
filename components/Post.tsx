import Avatar from "./Avatar";
import Card from "./Card";

import React, {
  FormEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { ProfileType } from "./PostFormCard";
import ReactTimeAgo from "react-time-ago";
import { UserContext } from "@/contexts/userContext";
import { photoUrl } from "@/helpers/photoHelpers";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { classNames } from "@/helpers/utils";
import CommentCard from "./CommentCard";
import LikeButton from "./LikeButton";
import { useDetectClickOutside } from "react-detect-click-outside";

export type PostType = {
  id: string;
  content: string;
  users: ProfileType;
  created_at: string;
  photos?: Array<string>;
};

export default function PostCard({ post }: { post: PostType }) {
  const [isMarked, setIsMarked] = useState<any>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentUser = useContext(UserContext);
  const myProfile = currentUser?.profile;
  const { users: authorProfile } = post;

  const closeDropdown = () => setDropdownOpen(false);
  const dropdownRef = useDetectClickOutside({
    onTriggered: closeDropdown,
  });

  const supabase = useSupabaseClient();
  const { photos } = post;

  useEffect(() => {
    postIsMarked();
  }, []);

  function openDropdown(event: MouseEvent) {
    event.stopPropagation();
    setDropdownOpen(true);
  }
  const postIsMarked = () => {
    if (!myProfile || !post) return;
    supabase
      .from("saved_posts")
      .select()
      .eq("post_id", post.id)
      .eq("user_id", myProfile?.id)
      .then((result) => {
        if (result.data?.length) {
          setIsMarked(true);
        } else {
          setIsMarked(false);
        }
      });
  };

  const savedPost = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isMarked) {
      return supabase
        .from("saved_posts")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", myProfile.id)
        .then((res) => {
          console.log(res);
          setIsMarked(false);
        });
    }
    supabase
      .from("saved_posts")
      .insert({ post_id: post.id, user_id: myProfile.id })
      .then((res) => {
        setIsMarked(true);
      });
  };

  return (
    <Card>
      <div className="flex gap-3">
        <div>
          <Link href={"/profile"}>
            <span className="cursor-pointer">
              <Avatar url={authorProfile?.avatar} />
            </span>
          </Link>
        </div>
        <div className="grow">
          <p>
            <Link href={`/profile/${authorProfile.id}`}>
              <span className="mr-1 font-semibold cursor-pointer text-neutralDark hover:underline">
                {authorProfile.name}
              </span>
            </Link>
            shared a post
          </p>
          <p className="text-gray-500 text-sm">
            <ReactTimeAgo date={new Date(post.created_at)} locale="fr-FR" />
          </p>
        </div>
        <div className="relative">
          <button className="text-gray-400" onClick={openDropdown}>
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
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="bg-red w-5 h-5 absolute top-0"></div>
          )}
          <>
            <div className="relative" ref={dropdownRef}>
              {dropdownOpen && (
                <div className="absolute -right-6 z-10 bg-white shadow-md flex flex-col items-center shadow-gray-300 p-3 rounded-sm border border-gray-100 w-52">
                  <button
                    onClick={savedPost}
                    className={classNames(
                      isMarked
                        ? "bg-gradient-to-r from-cyan-400 to-blue-800 text-white"
                        : "hover:bg-socialBlue hover:text-white",
                      "flex gap-3 py-2 my-2 -mx-4 px-2 w-full hover:scale-110 rounded-md transition-all  hover:shadow-md shadow-gray-300"
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isMarked ? "#3b5998" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={isMarked ? "none" : "currentColor"}
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                      />
                    </svg>
                    <span className="">
                      {isMarked ? "Post enregisté" : "Enregistrer le post"}
                    </span>
                  </button>
                  <a
                    href=""
                    className="flex gap-3 py-2 my-2 hover:bg-socialBlue bg-socialBg w-full px-2 hover:text-white rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300"
                  >
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
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                      />
                    </svg>
                    Silence
                  </a>
                  <a
                    href=""
                    className="flex gap-3 py-2 my-2 hover:bg-socialBlue hover:text-white bg-socialBg w-full px-2 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cacher
                  </a>
                  <a
                    href=""
                    className="flex gap-3 py-2 my-2 hover:bg-complementaryLight hover:text-white bg-orange-100 w-full px-2 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300"
                  >
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Supprimer
                  </a>
                  <a
                    href=""
                    className="flex gap-3 py-2 my-2 hover:bg-red-500 hover:text-white bg-red-100 w-full px-2 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300"
                  >
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
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    Reporter
                  </a>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
      <div>
        <p className="my-3 text-sm">{post.content}</p>
        {photos && (
          <div className="flex gap-4">
            {photos.map((photo) => (
              <div key={photo} className="">
                <img
                  src={photoUrl(photo)}
                  className="rounded-md max-h-full w-full object-fill		"
                  alt=""
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-5 flex gap-8">
        {/* LIKES */}
        <LikeButton currentUser={myProfile} post={post} />

        <button
          className="flex gap-2 items-center"
          onClick={(event) => {
            (
              event.currentTarget.parentNode?.parentElement?.querySelector(
                "#commentInput"
              ) as HTMLElement
            )?.focus();
          }}
        >
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
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          {/* {comments.length} */}
        </button>
        <button className="flex gap-2 items-center">
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
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
          4
        </button>
      </div>
      <CommentCard currentUser={myProfile} post={post} />
    </Card>
  );
}
