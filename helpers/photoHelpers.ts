export const photoUrl = (path: string | void, bucket = "photos") => {
  if (!path) return;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};
