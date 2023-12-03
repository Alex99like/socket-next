import { Database } from "./supabase"

export interface MessageSocket {
  id: string
  to: string
  from: string
  message: string
  type: string
  messageStatus: string
  self?: boolean
}

export type IMessage = Database['public']['Tables']['message']['Row']

export type HandleWriteType = { to: string, from: string, active: boolean }