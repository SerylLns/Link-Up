import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { PostType } from "./Post";

const LikeButton = ({
  currentUser,
  post,
}: {
  currentUser: any;
  post: PostType;
}) => {
  const [likes, setLikes] = useState<any>(null);
  const supabase = useSupabaseClient();

  const currentUserLiked: boolean =
    likes && !!likes.find((like: any) => like.user_id === currentUser?.id);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = () => {
    supabase
      .from("likes")
      .select()
      .eq("post_id", post.id)
      .then((result) => setLikes(result.data));
  };

  const handleLike = () => {
    if (currentUserLiked) {
      supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", currentUser.id)
        .then((res) => fetchLikes());
      return;
    }
    supabase
      .from("likes")
      .insert({ post_id: post.id, user_id: currentUser.id })
      .then(() => fetchLikes());
  };
  return (
    <button
      onClick={handleLike}
      className="flex gap-2 items-center text-complementaryLight"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={currentUserLiked ? "currentColor" : "none"}
        // fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
        />
      </svg>
      {likes?.length || "0"}
    </button>
  );
};

export default LikeButton;
