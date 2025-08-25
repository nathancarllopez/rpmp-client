import type { FileWithPath } from "@mantine/dropzone";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { queryClient } from "../queryClient";

export function useUpdateProfilePicMutation(userId: string | undefined) {
  if (!userId) {
    throw new Error("User Id is required to update profile picture");
  }

  return useMutation({
    mutationFn: (newPic: FileWithPath) => updateProfilePic(newPic, userId),
    onSuccess: (data) => queryClient.setQueryData(["profilePic", userId], data),
  });
}

async function updateProfilePic(
  newPic: FileWithPath,
  userId: string | undefined,
): Promise<string> {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const picPath = `profilePics/${userId}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(picPath, newPic, {
      upsert: true,
      contentType: newPic.type,
    });

  if (uploadError) {
    console.log("Error uploading profile pic:", uploadError.message);
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(picPath);

  const urlWithTimestamp = `${publicUrl}?ts=${Date.now()}`;

  return urlWithTimestamp;
}

// import type { FileWithPath } from "@mantine/dropzone";
// import { useMutation } from "@tanstack/react-query";
// import { supabase } from "@/supabase/client";
// import { queryClient } from "../queryClient";

// export function useUpdateProfilePicMutation(userId: string | undefined) {
//   if (!userId) {
//     throw new Error("User Id is required to update profile picture");
//   }

//   return useMutation({
//     mutationFn: (newPic: FileWithPath) => updateProfilePic(newPic, userId),
//     onSuccess: (data) =>
//       queryClient.setQueryData(
//         ["allProfilePics"],
//         (prevData: Record<string, string>) => ({ ...prevData, [userId]: data }),
//       ),
//   });
// }

// async function updateProfilePic(
//   newPic: FileWithPath,
//   userId: string | undefined,
// ): Promise<string> {
//   if (!userId) {
//     throw new Error("UserId is required");
//   }

//   const picPath = `profilePics/${userId}`;
//   const { error: uploadError } = await supabase.storage
//     .from("avatars")
//     .upload(picPath, newPic, {
//       upsert: true,
//       contentType: newPic.type,
//     });

//   if (uploadError) {
//     console.log("Error uploading profile pic:", uploadError.message);
//     throw uploadError;
//   }

//   const {
//     data: { publicUrl },
//   } = supabase.storage.from("avatars").getPublicUrl(picPath);

//   const timestampedUrl = `${publicUrl}?ts=${Date.now()}`

//   return timestampedUrl;
// }
