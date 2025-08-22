import { useMutation } from "@tanstack/react-query";
import type {
  CreatedUserInfo,
  InsertProfileRow,
  NewUserInfo,
  ProfileRow,
} from "@/types/rpmp-types";
import { camelToSnake, snakeToCamel } from "../key-converters";
import { queryClient } from "../queryClient";

export function useCreateUserMutation(invokerId: string) {
  return useMutation({
    mutationFn: (info: NewUserInfo) => createUser(info, invokerId),
    onSuccess: ({ profile, profilePicUrl }) => {
      queryClient.setQueryData(["allProfiles"], (prevData: ProfileRow[]) => [
        ...prevData,
        profile,
      ]);
      queryClient.setQueryData(["profilePic", profile.userId], profilePicUrl);
    },
  });
}

const endpoint = "/auth/create-user";

async function createUser(
  info: NewUserInfo,
  invokerId: string,
): Promise<CreatedUserInfo> {
  const authStr = `Bearer ${invokerId}`;
  const apiUrl = import.meta.env.VITE_BACKEND_URL + endpoint;

  const { email, profileData } = info;
  const insertData = camelToSnake<InsertProfileRow>(profileData);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authStr,
    },
    body: JSON.stringify({ email, profileData: insertData }),
  });

  if (!response.ok) {
    console.warn("Failed to create user");
    const error = await response.json();

    if (error instanceof Error) {
      console.warn(error.message);
    } else {
      console.warn(JSON.stringify(error));
    }

    throw new Error(error?.message || JSON.stringify(error));
  }

  const { profile, profilePicUrl } = await response.json();
  return {
    profile: snakeToCamel<ProfileRow>(profile),
    profilePicUrl,
  };
}
