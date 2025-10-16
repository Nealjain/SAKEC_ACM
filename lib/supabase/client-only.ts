import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// Using any type since Database type is not available
type Database = any;

// Check if Supabase environment variables are available
export const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Create a Supabase client for client-side usage
export function createClient() {
  return createClientComponentClient<Database>();
}

// Singleton pattern to avoid creating multiple clients
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export function getClientInstance() {
  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>();
  }
  return clientInstance;
}