import { createBrowserClient } from "@supabase/ssr";

// Create a fresh client each time to avoid any potential caching issues
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
