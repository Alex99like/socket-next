import { Profile } from "./profile"

const ProfilePage = async () => {
  // const { data: { session } } = await readUserSession()

  // if (session?.user) {
  //   const data = await searchProfile(session.user)
  //   console.log({ data })

  //   return <Profile   /> 
  // } else return null

  return (
    <Profile />
  )
}
 
export default ProfilePage