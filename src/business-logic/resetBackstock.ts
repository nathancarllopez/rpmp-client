/**
 * Just used for testing, should be deleted or not included in production
 */

import { supabase } from "@/supabase/client";
import { queryClient } from "@/tanstack-query/QueryClientProvider";

export async function resetBackstock() {
  const { error } = await supabase
    .from("backstock_proteins")
    .update({ claimed: false, deleted_on: null })
    .gt('id', 0);

  queryClient.invalidateQueries({ queryKey: ["backstock"] });

  console.log(error);
  
  console.log("done");
}