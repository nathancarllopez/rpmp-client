import { useMutation } from "@tanstack/react-query";
import type { InsertTimecardHistoryRow, TimecardHistoryRow } from "@/types/rpmp-types";
import { supabase } from "@/supabase/client";
import { snakeToCamel } from "../key-converters";
import { queryClient } from "../queryClient";

export function useInsertTimecardHistoryMutation() {
  return useMutation({
    mutationFn: insertTimecardHisotry,
    onSuccess: (data) =>
      queryClient.setQueryData(
        ["timecardHistory"],
        (curr: TimecardHistoryRow[] = []) => [data, ...curr]
      ),
  });
}

async function insertTimecardHisotry(
  newTimecards: InsertTimecardHistoryRow
): Promise<TimecardHistoryRow> {
  const { data, error } = await supabase
    .from("timecards_history")
    .insert(newTimecards)
    .select()
    .single();

  if (error) {
    console.warn("Failed to insert new timecard");
    console.warn(error.message);

    throw error;
  }

  return snakeToCamel<TimecardHistoryRow>(data);
}
