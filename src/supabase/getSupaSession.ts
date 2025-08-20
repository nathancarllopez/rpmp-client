import { supabase } from "./client";

export async function getSupaSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log("Error fetching session:", error.message);
    console.log(error.code);

    throw error;
  }

  return data.session;
}