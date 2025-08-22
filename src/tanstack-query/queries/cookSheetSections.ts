import { supabase } from "@/supabase/client";
import type { CookSheetSectionRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function cookSheetSectionsOptions() {
  return queryOptions({
    queryKey: ["cookSheetSections"],
    queryFn: getCookSheetSections,
    staleTime: Infinity,
  });
}

async function getCookSheetSections(): Promise<CookSheetSectionRow[]> {
  const { data, error } = await supabase
    .from("cook_sheet_sections")
    .select()
    .order("display_order", { ascending: true });

  if (error) {
    console.warn("Error fetching cook sheet sections");
    console.warn(error.message);

    throw error;
  }

  const cookSheetSections: CookSheetSectionRow[] = data.map((row) =>
    snakeToCamel<CookSheetSectionRow>(row),
  );

  return cookSheetSections;
}
