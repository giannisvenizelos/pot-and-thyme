import { createBrowserClient } from "@supabase/ssr";

const fallbackUrl = "https://ccvdkbdnykfhenhqkicm.supabase.co";
const fallbackPublishableKey = "sb_publishable_tveNh3M_egtdG9OYfD2Kbw_cDvOXSvy";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? fallbackUrl,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? fallbackPublishableKey,
  );
}
