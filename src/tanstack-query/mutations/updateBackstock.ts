import { useMutation } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import type { UpdateBackstockInfo } from "@/types/rpmp-types";
import { supabase } from "@/supabase/client";
import { queryClient } from "../queryClient";

export function useUpdateBackstockMutation() {
  return useMutation({
    mutationFn: updateBackstock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["backstock"] }),
  });
}

type RPCReturnType = {
  claimed: boolean
  created_at: string
  deleted_on: string
  id: number
  weight: number
}[] | null;

async function updateBackstock(
  updateInfo: UpdateBackstockInfo
): Promise<UpdateBackstockInfo> {
  const { data, error }: { data: RPCReturnType, error: PostgrestError | null } = await supabase.rpc(
    "update_backstock_rows",
    {
      updates: updateInfo,
    }
  );

  if (error) {
    console.log(error);
    console.warn("Error updating backstock rows");
    console.warn(error.message);

    throw error;
  }

  if (data === null) {
    throw new Error(`No data returned after updating backstock`)
  }

  const undoUpdateInfo = data.reduce((undoInfo, row) => {
    const idString = row.id.toString();

    undoInfo[idString] = {
      weight: row.weight,
      created_at: row.created_at,
      deleted_on: row.deleted_on,
      claimed: row.claimed,
    };

    return undoInfo;
  }, {} as UpdateBackstockInfo);

  return undoUpdateInfo;
}
