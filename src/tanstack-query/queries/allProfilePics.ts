import { supabase } from "@/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export function allProfilePicsOptions() {
  return queryOptions({
    queryKey: ["allProfilePics"],
    queryFn: getProfilePics,
    staleTime: Infinity,
  });
}

async function getProfilePics(): Promise<Record<string, string>> {
  const { data, error } = await supabase.storage
    .from("avatars")
    .list("profilePics");

  if (error) {
    console.warn("Supabase error listing profile pictures:");
    console.warn(error.message);

    throw error;
  } else if (!data) {
    throw new Error(
      "Supabase didn't return any data from the profilePics file in avatars storage bucket",
    );
  }

  const profilePics = data.reduce(
    (pics, file) => {
      const userId = file.name.substring(0, file.name.indexOf("."));
      const path = `profilePics/${file.name}`;
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      pics[userId] = publicUrl;

      return pics;
    },
    {} as Record<string, string>,
  );

  return profilePics;
}
