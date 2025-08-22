import { supabase } from "@/supabase/client";
import type { OrderHeaderRow } from "@/types/rpmp-types";
import { queryOptions } from "@tanstack/react-query";
import { snakeToCamel } from "../key-converters";

export function orderHeadersOptions() {
  return queryOptions({
    queryKey: ["orderHeaders"],
    queryFn: getOrderHeaders,
    staleTime: Infinity,
  });
}

async function getOrderHeaders(): Promise<OrderHeaderRow[]> {
  const { data, error } = await supabase
    .from("order_headers")
    .select()
    .order("label", { ascending: true });

  if (error) {
    console.warn("Failed to fetch order headers");
    console.warn(error.message);

    throw error;
  }

  const orderHeaders: OrderHeaderRow[] = data.map((row) =>
    snakeToCamel<OrderHeaderRow>(row),
  );

  return orderHeaders;
}
