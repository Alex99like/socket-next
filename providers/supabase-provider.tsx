'use client'

//import { Database } from '@/types/supabase'
import { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { SessionContextProvider, SupabaseClient } from '@supabase/auth-helpers-react'
import { createSupabaseBrowerClient } from '@/lib/supabase/client'
import { createContext } from 'react'
import { IProfile } from '@/types/profile'
import { searchProfileClient } from '@/lib/supabase/client/profile'

interface SupabaseProviderProps {
  supabase: SupabaseClient<any>
  profile: IProfile | null
}

const SupabaseContext = createContext<SupabaseProviderProps>({} as SupabaseProviderProps)

export const useSupabase = () => useContext(SupabaseContext)

export const SupabaseProvider = ({ 
  children 
}: PropsWithChildren) => {
  const [supabase] = useState<SupabaseClient<any>>(() => 
    createSupabaseBrowerClient()
  )

  const [profile, setProfile] = useState<null | IProfile>(null)

  const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const profile = await searchProfileClient(user)
      profile && setProfile(profile)
    }
  }
  
  useEffect(() => {
    getProfile()
  }, [])

  

  return (
    <SupabaseContext.Provider value={{ profile: profile, supabase: supabase }} >
      {children}
    </SupabaseContext.Provider>
  )
}

