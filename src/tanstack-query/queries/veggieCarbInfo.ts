import { supabase } from "@/supabase/client";
import type { VeggieCarbInfoRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function veggieCarbInfoOptions() {
  return queryOptions({
    queryKey: ["veggieCarbInfo"],
    queryFn: getVeggieCarbInfo,
    staleTime: Infinity,
  });
}

async function getVeggieCarbInfo(): Promise<VeggieCarbInfoRow[]> {
  const { data, error } = await supabase.from("veggies_carbs").select();

  if (error) {
    console.warn("Failed to fetch veggies and carbs");
    console.warn(error.message);

    throw error;
  }

  const veggieCarbInfo: VeggieCarbInfoRow[] = data.map((row) =>
    snakeToCamel<VeggieCarbInfoRow>(row)
  );

  return veggieCarbInfo;
}
