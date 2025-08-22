import { supabase } from "@/supabase/client";
import type { StoreInfoRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function storeInfoOptions() {
  return queryOptions({
    queryKey: ["storeInfo"],
    queryFn: getStoreInfo,
    staleTime: Infinity,
  });
}

async function getStoreInfo(): Promise<StoreInfoRow[]> {
  const { data, error } = await supabase
    .from("store_info")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.warn("Failed to fetch store info rows");
    console.warn(error.message);

    throw error;
  }

  const storeInfo: StoreInfoRow[] = data.map((row) =>
    snakeToCamel<StoreInfoRow>(row),
  );

  return storeInfo;
}
