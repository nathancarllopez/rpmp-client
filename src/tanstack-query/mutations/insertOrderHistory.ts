import { useMutation } from "@tanstack/react-query";
import type { InsertOrderHistoryRow, OrderHistoryRow } from "@/types/rpmp-types";
import { supabase } from "@/supabase/client";
import { snakeToCamel } from "../key-converters";
import { queryClient } from "../queryClient";

export function useInsertOrderHistoryMutation() {
  return useMutation({
    mutationFn: insertOrderHistory,
    onSuccess: (data) =>
      queryClient.setQueryData(["orderHistory"], (curr: OrderHistoryRow[] = []) => [data, ...curr]),
  });
}

async function insertOrderHistory(
  newOrder: InsertOrderHistoryRow
): Promise<OrderHistoryRow> {
  const { data, error } = await supabase
    .from("order_history")
    .insert(newOrder)
    .select()
    .single();

  if (error) {
    console.warn("Failed to insert new order");
    console.warn(error.message);

    throw error;
  }

  return snakeToCamel<OrderHistoryRow>(data);
}
