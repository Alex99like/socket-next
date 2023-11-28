import { SupabaseClient, User } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "../server"
import { Database } from "@/types/supabase"
import { createSupabaseBrowerClient } from "../client"
import { IProfile } from "@/types/profile"

export const searchProfileClient = async (user: User): Promise<IProfile> => {
  const supabase: SupabaseClient<Database> = createSupabaseBrowerClient()

  const { data } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (data) return data
    
  const newProfile = await supabase.from('profile').insert({
    user_id: user.id,
  })

  const { data: newData } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()
  
  if (newData) return newData

  throw Error()
}

export const updateProfileClient = async ({ id, about, imageUrl, name }: {
  id: string,
  imageUrl: string,
  name: string,
  about: string
}) => {
  const supabase: SupabaseClient<Database> = createSupabaseBrowerClient()

  const { data, error } = await supabase.from('profile')
    .upsert({
      name: name,
      about: about,
      imageUrl: imageUrl
    })
    .eq('id', id)

  console.log({ data, error })

  return data
}