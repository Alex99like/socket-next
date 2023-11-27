import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const SignOut = () => {
  const logout = async () => {
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
    redirect('/auth')
  }

  return (
    <button onClick={logout}>Logout</button>
  )
}
