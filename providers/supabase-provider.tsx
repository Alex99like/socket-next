'use client'

import { Database } from '@/types/supabase'
import { PropsWithChildren, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

interface SupabaseProviderProps {}

export const SupabaseProvider = ({ 
  children 
}: PropsWithChildren<SupabaseProviderProps>) => {
  const [supabaseClient] = useState(() => 
    createClientComponentClient<Database>()
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}

