import { motion } from 'framer-motion'
import cn from 'clsx'
import styles from './message.module.scss' 
import { MessageSocket } from '@/types/message'

export const MessageText = ({ msg, profileId }: { msg: MessageSocket, profileId: string | undefined }) => {
  const from = profileId === msg.from
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
      <div className={styles.message}>
        {msg.message}
      </div>
    </motion.div>
  )
}
