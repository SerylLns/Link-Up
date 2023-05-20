import Layout from "@/components/Layout";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Inter } from "next/font/google";
import LoginPage from "./login";
import PostFormCard, { ProfileType } from "@/components/PostFormCard";
import { useEffect, useState } from "react";
import PostCard, { PostType } from "@/components/Post";
import TimeAgo from "javascript-time-ago";
import fr from "javascript-time-ago/locale/fr.json";
import { UserContext } from "@/contexts/userContext";

TimeAgo.addDefaultLocale(fr);
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [posts, setPosts] = useState<any>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id)
      .then((response) => {
        if (response.data?.length) {
          setProfile(response.data[0]);
        }
      });
  }, [session?.user?.id]);

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
      <UserContext.Provider value={{ profile }}>
        <PostFormCard onPost={fetchPost} />
        {posts.length &&
          posts.map((post: PostType) => {
            return <PostCard key={post.id} post={post} />;
          })}
      </UserContext.Provider>
    </Layout>
  );
}
