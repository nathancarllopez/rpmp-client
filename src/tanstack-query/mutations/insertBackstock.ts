import { useMutation } from "@tanstack/react-query";
import type { InsertBackstockRow } from "@/types/rpmp-types";
import { supabase } from "@/supabase/client";
import { queryClient } from "../queryClient";

export function useInsertBackstockMutation() {
  return useMutation({
    mutationFn: insertBackstock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["backstock"] }),
  });
}

async function insertBackstock(newBackstock: InsertBackstockRow[]) {
  const { error } = await supabase
    .from("backstock_proteins")
    .insert(newBackstock);

  if (error) {
    console.warn("Failed to insert new backstock rows");
    console.warn(error.message);

    throw error;
  }
}
