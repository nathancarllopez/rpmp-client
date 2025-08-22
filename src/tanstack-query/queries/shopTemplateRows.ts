import { supabase } from "@/supabase/client";
import type { ShopTemplateRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function shopTemplateRowsOptions() {
  return queryOptions({
    queryKey: ["shopTemplateRows"],
    queryFn: getShopTemplateRows,
    staleTime: Infinity,
  });
}

async function getShopTemplateRows(): Promise<ShopTemplateRow[]> {
  const { data, error } = await supabase.from("shop_sheet_template").select();

  if (error) {
    console.warn("Failed to fetch shop template rows");
    console.warn(error.message);

    throw error;
  }

  const templateRows: ShopTemplateRow[] = data.map((row) =>
    snakeToCamel<ShopTemplateRow>(row),
  );

  return templateRows;
}
