import { IProfile } from "@/types/profile"
import styles from './sidebar.module.scss'
import Image from "next/image"
import cn from 'clsx'
import { useSocket } from "@/providers/socket-provider"
import { useSupabase } from "@/providers/supabase-provider"
import { useChatStore } from "../../use-chat"

export const ItemPerson = ({ profile, image, setProfile }: { profile: IProfile, image: string, setProfile: (prof: IProfile) => void }) => {
  const { onlineUsers } = useSocket()
  const { message } = useChatStore()

  return (
    <div className={styles.item} onClick={() => setProfile(profile)}>
      <Image
        src={image}
        alt="Avatar"
        width={40}
        height={40}
        className={styles.image}
      />
      {profile.name}
      <span className={styles.messages}>{message.filter(msg => msg.from === profile.id).length}</span>
      <div 
        className={cn(styles.status, { [styles.online]: onlineUsers.includes(profile.id) })}
      >
        <span>
          {onlineUsers.includes(profile.id) ? 'online' : 'offline'}
        </span>
        <b />
      </div>
    </div>
  )
}
