import { supabase } from "./client";

const bucketName = "avatars";
const folderName = "profilePics";

export default function getProfilePic(userId: string): string {
  const imagePath = `${folderName}/${userId}`;
  const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(imagePath);

  return publicUrl;
}