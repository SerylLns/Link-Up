import Layout from "@/components/Layout";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Inter } from "next/font/google";
import LoginPage from "./login";
import NavigationCard from "@/components/NavigationCard";
import PostFormCard from "@/components/PostFormCard";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    supabase
      .from("posts")
      .select()
      .then((response) => {
        console.log(response);
      });
  }, []);

  if (!session) {
    return <LoginPage />;
  }
  return (
    <Layout>
      <PostFormCard />
    </Layout>
  );
}
