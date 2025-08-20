import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../QueryClientProvider";
import type { ProfileRow } from "@/types/rpmp-types";

export function useDeleteUserMutation(invokerId: string) {
  return useMutation({
    mutationFn: (idToDelete: string) => deleteUser(idToDelete, invokerId),
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["allProfiles"], (prevData: ProfileRow[]) =>
        [...prevData].filter((profile) => profile.userId !== deletedId)
      );
      queryClient.removeQueries({
        queryKey: ["profilePic", deletedId],
        exact: true,
      });
      queryClient.removeQueries({
        queryKey: ["settings", deletedId],
        exact: true,
      });
    },
  });
}

const endpoint = "/auth/delete-user";

async function deleteUser(
  idToDelete: string,
  invokerId: string
): Promise<string> {
  const apiUrl = import.meta.env.VITE_BACKEND_URL + endpoint;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${invokerId}`,
    },
    body: JSON.stringify({ idToDelete }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete user");
  }

  return idToDelete;
}
