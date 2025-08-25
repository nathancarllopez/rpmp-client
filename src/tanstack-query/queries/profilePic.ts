import { supabase } from "@/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export function profilePicOptions(userId: string) {
  return queryOptions({
    queryKey: ["profilePic", userId],
    queryFn: () => getProfilePic(userId),
    staleTime: Infinity,
  });
}

const bucketName = "avatars";
const folderName = "profilePics";

async function getProfilePic(userId: string): Promise<string> {
  const imagePath = `${folderName}/${userId}`;
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(imagePath);

  const urlWithTimestamp = `${publicUrl}?ts=${Date.now()}`;

  return urlWithTimestamp;
}
