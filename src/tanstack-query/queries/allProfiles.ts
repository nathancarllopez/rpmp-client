import { supabase } from "@/supabase/client";
import type { ProfileRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function allProfilesOptions() {
  return queryOptions({
    queryKey: ["allProfiles"],
    queryFn: getAllProfiles,
    staleTime: Infinity,
  });
}

async function getAllProfiles(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .order("first_name", { ascending: true })
    .order("last_name", { ascending: true });

  if (error) {
    console.log("Error fetching profiles:", error.message);
    console.log(error.code);

    throw error;
  }

  const profiles: ProfileRow[] = data.map((profile) => snakeToCamel<ProfileRow>(profile));

  return profiles;
}
