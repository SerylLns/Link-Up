import Layout from "@/components/Layout";
import PostCard from "@/components/Post";
import { UserContextProvider } from "@/contexts/userContext";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";

const SavedPostPage = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [savedPosts, setSavedPosts] = useState<any>([]);

  useEffect(() => {
    if (session?.user.id) {
      supabase
        .from("saved_posts")
        .select(" posts(*, users(*))")
        .eq("user_id", session.user.id)
        .then((res) => setSavedPosts(res.data));
    }
  }, [session?.user.id]);

  return (
    <Layout>
      <UserContextProvider>
        <h1 className="text-3xl flex items-center gap-2 underline py-6 text-complementaryLight">
          <span className="text-primary">Posts enregistés</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        </h1>
        {savedPosts.map(({ posts }: any) => {
          return <PostCard post={posts} key={posts.id} />;
        })}
      </UserContextProvider>
    </Layout>
  );
};

export default SavedPostPage;
