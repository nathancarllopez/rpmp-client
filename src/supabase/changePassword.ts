import { supabase } from "./client";

export default async function changePassword(
  newPassword: string,
): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
    data: { has_signed_in: true },
  });

  if (error) {
    console.log("Error updating password:", error.message);
    console.log(error.code);

    throw error;
  }
}
