import { useSupabase } from '@/providers/supabase-provider'
import styles from './header-chat.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { useChatStore } from '../../use-chat'
import Image from 'next/image'

export const HeaderChat = () => {
  const { currentUser } = useChatStore()
  const { supabase } = useSupabase()

  return (
    <AnimatePresence>
      {currentUser && (
        <div 
          className={styles.wrapper}
          //initial={{ opacity: 0, translateY: -70 }}
          //animate={{ opacity: 1, translateY: 0 }}
          //exit={{ opacity: 0, translateY: -70 }}
        >
          <div className={styles.image}>
            <Image
              width={40}
              height={40}
              alt='avatar'
              src={supabase.storage.from('avatar_img').getPublicUrl(currentUser?.imageUrl || '').data.publicUrl}
            />
          </div>
          <h4>{currentUser.name}</h4>
        </div>
      )}
    </AnimatePresence>
  )
}
