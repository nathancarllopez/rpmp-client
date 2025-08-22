import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { queryClient } from "../queryClient";

export function useMarkBackstockUnavailableMutation() {
  return useMutation({
    mutationFn: markBackstockUnavailable,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["backstock"] }),
  });
}

async function markBackstockUnavailable(usedBackstockIds: Set<number>) {
  const { error: proteinError } = await supabase
    .from("backstock_proteins")
    .update({ claimed: true })
    .in("id", Array.from(usedBackstockIds));

  if (proteinError) {
    console.warn("Failed to mark protein backstock rows as unavailable");
    console.warn(proteinError.message);

    throw proteinError;
  }

  const { error: veggieCarbError } = await supabase
    .from("backstock_veggie_carb")
    .update({ claimed: true })
    .in("id", Array.from(usedBackstockIds));

  if (veggieCarbError) {
    console.warn("Failed to mark veggie carb backstock rows as unavailable");
    console.warn(veggieCarbError.message);

    throw veggieCarbError;
  }
}
