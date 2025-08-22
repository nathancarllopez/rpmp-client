import { supabase } from "@/supabase/client";
import type { PullListRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function pullListOptions() {
  return queryOptions({
    queryKey: ["pullList"],
    queryFn: getPullList,
    staleTime: Infinity,
  });
}

async function getPullList(): Promise<PullListRow[]> {
  const { data, error } = await supabase
    .from("pull_list")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.warn("Failed to fetch pull list");
    console.warn(error.message);

    throw error;
  }

  const pullList: PullListRow[] = data.map((row) =>
    snakeToCamel<PullListRow>(row),
  );

  return pullList;
}
