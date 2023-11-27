import readUserSession from "@/lib/supabase/action"

const PageTest = async () => {
  const { data } = await readUserSession()

  console.log(data)

  return (
    <div>page</div>
  )
}

export default PageTest