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
    onSuccess: (data) =>
      queryClient.setQueryData(
        ["allProfilePics"],
        (prevData: Record<string, string>) => ({ ...prevData, userId: data })
      ),
  });
}

async function updateProfilePic(
  newPic: FileWithPath,
  userId: string | undefined
): Promise<string> {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const originalName = newPic.name;
  const extension = originalName
    .substring(originalName.lastIndexOf(".") + 1)
    .toLowerCase();

  if (!extension || extension.length > 5) {
    throw new Error("Invalid file extension");
  }

  const newFileName = `${userId}.${extension}`;
  const newFilePath = `profilePics/${newFileName}`;

  // Upload new profile pic
  const { data: newPicData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(newFilePath, newPic, {
      upsert: true,
      contentType: newPic.type,
    });

  if (uploadError) {
    console.log("Error uploading profile pic:", uploadError.message);
    throw uploadError;
  }

  // List all profilePics files
  const { data: existingFiles, error: listError } = await supabase.storage
    .from("avatars")
    .list("profilePics");

  if (listError) {
    console.log("Error listing files for cleanup:", listError.message);
    throw listError;
  }

  // Find and delete other files for this userId (with different extension)
  const filesToDelete =
    existingFiles
      ?.filter(
        (file) => file.name.startsWith(userId) && file.name !== newFileName
      )
      .map((file) => `profilePics/${file.name}`) ?? [];

  if (filesToDelete.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove(filesToDelete);

    if (deleteError) {
      console.log("Error deleting old profile pics:", deleteError.message);
    }
  }

  const { fullPath } = newPicData;
  const { data } = supabase.storage.from("avatars").getPublicUrl(fullPath);

  return data.publicUrl;
}
