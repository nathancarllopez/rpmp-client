import { supabase } from "@/supabase/client";
import type { ProfileRow, UpdateProfileInfo } from "@/types/rpmp-types";
import { camelToSnake, snakeToCamel } from "../key-converters";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryClient";
import type { SupaUpdateProfileRow } from "@/types/supa-types";

export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedProfile: ProfileRow) =>
      queryClient.setQueryData(["allProfiles"], (prevData: ProfileRow[]) =>
        prevData.map((profile) => {
          if (profile.userId === updatedProfile.userId) {
            return updatedProfile;
          }
          return profile;
        }),
      ),
  });
}

async function updateUser(updateInfo: UpdateProfileInfo): Promise<ProfileRow> {
  const { profileUpdates, newPassword, newEmail } = updateInfo;
  const { userId } = profileUpdates;

  if (newPassword !== null || newEmail !== null) {
    await changeEmailAndPassword(newPassword, newEmail);
  }

  const supaUpdates = camelToSnake<SupaUpdateProfileRow>(profileUpdates);

  const { data, error } = await supabase
    .from("profiles")
    .update(supaUpdates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.warn(error.message);

    throw error;
  }

  return snakeToCamel<ProfileRow>(data);
}

const endpoint = "/auth/update-user";

async function changeEmailAndPassword(
  newPassword: string | null,
  newEmail: string | null,
) {
  console.log(newPassword);
  console.log(newEmail);

  const apiUrl = import.meta.env.VITE_BACKEND_URL + endpoint;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword, newEmail }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
}
