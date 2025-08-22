import { supabase } from "@/supabase/client";
import type { RoleInfoRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function rolesOptions() {
  return queryOptions({
    queryKey: ["roles"],
    queryFn: getRoles,
    staleTime: Infinity,
  });
}

async function getRoles(): Promise<RoleInfoRow[]> {
  const { data, error } = await supabase.from("role_info").select();

  if (error) {
    console.warn("Failed to fetch role information");
    console.warn(error.message);

    throw error;
  }

  const roleInfo: RoleInfoRow[] = data.map((row) =>
    snakeToCamel<RoleInfoRow>(row),
  );

  return roleInfo;
}
