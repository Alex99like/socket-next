import { SupabaseClient, User } from "@supabase/supabase-js"
import { createSupabaseServerClient } from "../server"
import { Database } from "@/types/supabase"
import { createSupabaseBrowerClient } from "../client"
import { IProfile } from "@/types/profile"

export const searchProfileClient = async (user: User): Promise<IProfile | null> => {
  const supabase: SupabaseClient<Database> = createSupabaseBrowerClient()

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return data
}

export const updateProfileClient = async ({ id, about, imageUrl, name, user_id }: {
  id?: string,
  imageUrl: string,
  name: string,
  about: string,
  user_id: string
}): Promise<IProfile> => {
  const supabase: SupabaseClient<Database> = createSupabaseBrowerClient()

  const profile = {
    name: name,
    about: about,
    imageUrl: imageUrl,
    user_id: user_id
  }

  if (id) {
    const { data, error } = await supabase.from('profile')
      .update(profile)
      .eq('id', id)
      .select('*')
      .maybeSingle()

    if (data) return data
    else throw new Error('Error Filed')
  } else {
    const { data, error } = await supabase.from('profile')
      .upsert(profile)
      .select('*')
      .maybeSingle()
    console.log(error)
    if (data) return data
    else throw new Error('Error Filed')
  }
}