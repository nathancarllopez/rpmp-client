import { supabase } from "./client";

export default async function doLogout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.warn("Error signing out:");
    console.warn(error.code);
    console.warn(error.message);

    throw error;
  }
}