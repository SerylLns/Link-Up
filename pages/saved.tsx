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
        {savedPosts.map(({ posts }: any) => {
          return <PostCard post={posts} key={posts.id} />;
        })}
      </UserContextProvider>
    </Layout>
  );
};

export default SavedPostPage;
