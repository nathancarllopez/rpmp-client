import { supabase } from "@/supabase/client";
import type { AllBackstockRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function backstockOptions() {
  return queryOptions({
    queryKey: ["backstock"],
    queryFn: getBackstock,
    staleTime: Infinity,
  });
}

async function getBackstock(): Promise<AllBackstockRow[]> {
  const { data, error } = await supabase.from("all_backstock").select();

  if (error) {
    console.warn("Failed to fetch backstock view");
    console.warn(error.message);

    throw error;
  }

  const backstockData: AllBackstockRow[] = data.map((row) =>
    snakeToCamel<AllBackstockRow>(row),
  );

  return backstockData;
}
