import { useSupabase } from "@/providers/supabase-provider"
import { useChatStore } from "../../use-chat"
import styles from './chat-container.module.scss'
import cn from 'clsx'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { MessageText } from "../message/message"
import { MessageImage } from "../message/message-image"
//import { MessageVoice } from "../message/message-voice"
import dynamic from "next/dynamic"

const MessageVoice = dynamic(() => import('../message/message-voice'), { ssr: false })

export const ChatContainer = () => {
  const { message } = useChatStore()
  const { profile } = useSupabase()
  const { currentUser } = useChatStore()
  //console.log(message)
  return (
    <div className={styles.wrapper}>
      <LayoutGroup>
        {message.filter(el =>
            el.from === profile?.id && el.to === currentUser?.id ||
            el.to === profile?.id && el.from === currentUser?.id
          ).map((msg) => {
          if (msg.type === 'text') return <MessageText msg={msg} profileId={profile?.id} />
          if (msg.type === 'image') return <MessageImage msg={msg} profileId={profile?.id} />
          if (msg.type === 'audio') return <MessageVoice msg={msg} profileId={profile?.id} />
        })}
      </LayoutGroup>
    </div>
  )
}
