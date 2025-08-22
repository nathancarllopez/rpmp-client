import { supabase } from "@/supabase/client";
import type { ProteinRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function proteinsOptions() {
  return queryOptions({
    queryKey: ["proteins"],
    queryFn: getProteins,
    staleTime: Infinity,
  });
}

async function getProteins(): Promise<ProteinRow[]> {
  const { data, error } = await supabase
    .from("proteins")
    .select()
    .order("label", { ascending: true });

  if (error) {
    console.warn("Failed to fetch proteins");
    console.warn(error.message);

    throw error;
  }

  const proteins: ProteinRow[] = data.map((row) =>
    snakeToCamel<ProteinRow>(row),
  );

  return proteins;
}
