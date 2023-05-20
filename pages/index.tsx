import Layout from "@/components/Layout";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Inter } from "next/font/google";
import LoginPage from "./login";
import PostFormCard, { ProfileType } from "@/components/PostFormCard";
import { useEffect, useState } from "react";
import PostCard, { PostType } from "@/components/Post";
import { UserContext, UserContextProvider } from "@/contexts/userContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [posts, setPosts] = useState<any>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = () => {
    supabase
      .from("posts")
      .select("id, content, created_at, photos, profiles(id, avatar, name) ")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data?.length) setPosts(data);
      });
  };

  if (!session) {
    return <LoginPage />;
  }
  return (
    <Layout>
      <UserContextProvider>
        <PostFormCard onPost={fetchPost} />
        {posts.length &&
          posts.map((post: PostType) => {
            return <PostCard key={post.id} post={post} />;
          })}
      </UserContextProvider>
    </Layout>
  );
}
