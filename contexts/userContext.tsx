import { ProfileType } from "@/components/PostFormCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { Context, createContext, useEffect, useState } from "react";

export const userInitialState = {
  name: null,
  id: null,
  avatar:
    "https://w7.pngwing.com/pngs/686/219/png-transparent-youtube-user-computer-icons-information-youtube-hand-silhouette-avatar.png",
  created_at: null,
};

export const UserContext: Context<any> = createContext({});

export function UserContextProvider({ children }: { children: any }) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase
      .from("users")
      .select()
      .eq("id", session.user.id)
      .then((result) => {
        setProfile(result.data?.[0]);
      });
  }, [session?.user?.id]);

  return (
    <UserContext.Provider value={{ profile }}>{children}</UserContext.Provider>
  );
}
