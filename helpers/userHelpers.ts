import { SupabaseClient } from "@supabase/supabase-js";
import { photoUrl } from "./photoHelpers";
import { pluralize } from "./utils";

type uploadUserProfileType = {
  supabase: SupabaseClient;
  userId: string;
  file: File;
};

export const uploadUserProfileImage = async (
  supabase: SupabaseClient,
  userId: string,
  file: File,
  column: string
) => {
  return new Promise(async (resolve, reject) => {
    const name = Date.now() + file.name;
    const bucket = column + "s";
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(name, file);

    if (error) reject("Error userHelpers#uploadUserProfileImage");
    if (data) {
      const newUrl = photoUrl(data.path, bucket);
      supabase
        .from("users")
        .update({ [column]: newUrl })
        .eq("id", userId)
        .then((res) => {
          if (!res.error) resolve(res);
          else reject(res.error);
        });
    }
  });
};

export const getAddressByIP = async () => {
  const { data } = await fetch(
    `https://api.ipbase.com/v2/info?apikey=${process.env.NEXT_PUBLIC_IP_FETCH_KEY}`
  ).then((res) => res.json());
  if (data) {
    const city = data.location.city.name;
    const country = data.location.country.name;
    return city + ", " + country;
  } else return false;
};
