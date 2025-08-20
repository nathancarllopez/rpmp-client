import { supabase } from "@/supabase/client";
import type { ProfileRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function profileByIdOptions(userId: string) {
  return queryOptions({
    queryKey: ["profile", userId],
    queryFn: () => getProfileById(userId),
    staleTime: Infinity
  })
}

async function getProfileById(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", userId)
    .single();

  if (error) {
    console.warn("Error fetching profile:");
    console.warn(error.code);
    console.warn(error.message);
    
    throw error;
  }

  return snakeToCamel<ProfileRow>(data);
}
