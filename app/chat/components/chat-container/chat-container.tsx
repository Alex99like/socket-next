import { useSupabase } from "@/providers/supabase-provider"
import { useChatStore } from "../../use-chat"
import styles from './chat-container.module.scss'
import cn from 'clsx'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"

export const ChatContainer = () => {
  const { message } = useChatStore()
  const { profile } = useSupabase()
  const { currentUser } = useChatStore()
  console.log(message)
  return (
    <div className={styles.wrapper}>
      <LayoutGroup>
        {message.filter(el =>
            el.from === profile?.id && el.to === currentUser?.id ||
            el.to === profile?.id && el.from === currentUser?.id
          ).map((msg) => {
          const from = profile?.id === msg.from
          return (
            <motion.div 
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              className={cn(styles.container, {
                [styles.from]: !from,
                [styles.to]: from
              })} 
              key={msg.message}
             >
                <div className={styles.message}>
                  {msg.message}
                </div>
              </motion.div>
            )
        })}
      </LayoutGroup>
    </div>
  )
}
