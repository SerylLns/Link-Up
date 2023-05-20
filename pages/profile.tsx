import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import Cover from "@/components/Cover";
import Layout from "@/components/Layout";
import PostCard from "@/components/Post";
import ProfileContent from "@/components/ProfilContent";
import ProfileTabs from "@/components/ProfileTabs";
import { UserContext } from "@/contexts/userContext";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

const ProfilePage = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const userId = router.query?.id;
  const session = useSession();
  const supabase = useSupabaseClient();
  const coverUrl = profile?.cover;
  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  const fetchUser = () => {
    supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .then((response) => {
        if (!response.error && response.data) {
          setProfile(response.data[0]);
        }
      });
  };

  const { asPath: pathname } = router;
  const tab = router?.query?.tabs?.[0] || "posts";

  const isProfileOwner = profile?.id === session?.user.id;

  const isPosts =
    pathname.includes("posts") || pathname.includes("/profile/posts");

  const isAbout = pathname.includes("about");

  const isFriends = pathname.includes("friends");

  const isPhotos = pathname.includes("photos");

  const tabClasses =
    "flex gap-1 px-4 py-1 mx-0.5 items-center border-b-2 opacity-70 border-white";

  const activeTabClasses =
    "flex gap-1 px-4 py-1 mx-0.5 items-center border-complementaryLight border-b-2 text-complementaryLight opacity-100 font-bold";

  return (
    <Layout>
      <UserContext.Provider value={{ profile }}>
        <Card noPadding={true}>
          <div className="relative overflow-hidden rounded-md">
            <Cover
              url={coverUrl}
              editable={isProfileOwner}
              onChange={fetchUser}
            />
            <div className="absolute top-24 left-4">
              {profile && (
                <Avatar
                  size={"lg"}
                  url={profile.avatar}
                  editable={isProfileOwner}
                  onChange={fetchUser}
                />
              )}
            </div>

            <div className="p-4 pt-0 md:pt-4 pb-0">
              <div className="ml-24 md:ml-40">
                <h1 className=" text-3xl text-neutralDark font-bold">
                  {profile?.name}
                </h1>

                <div className="text-gray-400 mt-2 leading-4">
                  {profile?.place || "Dans sa chambre"}
                </div>
              </div>

              <ProfileTabs active={tab} userId={userId} />
            </div>
          </div>
        </Card>
        <ProfileContent activeTab={tab} userId={userId} />
      </UserContext.Provider>
    </Layout>
  );
};

export default ProfilePage;
