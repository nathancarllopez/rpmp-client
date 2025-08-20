import { supabase } from "./client";

const endpoint = "/changePassword";

export default async function resetPassword(email: string): Promise<void> {
  const redirectTo = import.meta.env.VITE_SUPABSE_REDIRECT_URL + endpoint;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.log("Error requesting password reset:", error.message);
    console.log(error.code);

    throw error;
  }
}
