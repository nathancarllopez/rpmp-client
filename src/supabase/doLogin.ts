import { supabase } from "./client";

export default async function doLogin(
  email: string,
  password: string
): Promise<boolean> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.warn("Error signing in:");
    console.warn(error.code);
    console.warn(error.message);

    throw error;
  }

  const { user } = data;
  if (!user) {
    throw new Error("No user object returned");
  } else if (!user.user_metadata) {
    throw new Error("No meta data for this user object");
  }

  const firstLogin = !user.user_metadata.has_signed_in;
  return firstLogin;
}
