import { MessageSocket } from "@/types/message"
import { motion } from 'framer-motion'
import cn from 'clsx'
import styles from './message.module.scss'
import Image from "next/image"
import { useSupabase } from "@/providers/supabase-provider"

export const MessageImage = ({ msg, profileId }: { msg: MessageSocket, profileId: string | undefined }) => {
  const { supabase } = useSupabase()  
  const from = profileId === msg.from
  const url = supabase.storage
    .from('message_img')
    .getPublicUrl(msg.message)
    
  return (
    <motion.div 
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      className={cn(styles.container, {
        [styles.from]: !from,
        [styles.to]: from
      })} 
      key={msg.id}
     >
      <div className={styles.message} style={{ padding: '4px 5px' }}>
        <img 
          src={url.data.publicUrl}
          className={styles.image}
          alt="image"
        />
      </div>
    </motion.div>
  )
}
