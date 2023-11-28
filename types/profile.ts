import { Database } from "./supabase";

export type IProfile = Database['public']['Tables']['profile']['Row']

