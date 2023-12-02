import { Database } from "./supabase"

export interface MessageSocket {
  id: string
  to: string
  from: string
  message: string
  type: string
  messageStatus: string
}

export type IMessage = Database['public']['Tables']['message']['Row']