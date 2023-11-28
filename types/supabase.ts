export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          about: string | null
          created_at: string
          id: string
          imageUrl: string | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string
          id?: string
          imageUrl?: string | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string
          id?: string
          imageUrl?: string | null
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
