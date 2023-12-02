import { useEffect, useRef, useState } from 'react'
import styles from './message-bar.module.scss'
import { BsSendFill } from "react-icons/bs";
import { useSocket } from '@/providers/socket-provider';
import { io } from 'socket.io-client';
import { useChatStore } from '../../use-chat';
import { AnimatePresence, motion } from 'framer-motion';
import { useSupabase } from '@/providers/supabase-provider';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { GrEmoji } from "react-icons/gr";

export const MessageBar = () => {
  const [value, setValue] = useState('')
  const { profile } = useSupabase()
  const { socket, onlineUsers } = useSocket()
  const { currentUser, setMessage } = useChatStore()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const targetElement = event.target as HTMLElement; // Type assertion here
      if (targetElement.id !== 'emoji-open') {
        if (
          emojiPickerRef.current && 
          !emojiPickerRef.current.contains(targetElement)
        ) {
          setShowEmojiPicker(false)
        }
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (e: EmojiClickData) => {
    setValue((prevMessage) => prevMessage += e.emoji)
  }

  
  const sendMessage = () => {
    if (currentUser && profile) {
      socket?.emit('send-msg', {
        to: currentUser.id,
        from: profile.id,
        type: 'text',
        message: value,
        messageStatus: 'send'
      })
      setMessage({
        to: currentUser.id,
        from: profile.id,
        type: 'text',
        message: value,
        messageStatus: 'send'
      })
      setValue('')
    }
  }
  
  console.log(showEmojiPicker)
  return (
    <AnimatePresence>
      {currentUser && (
        <motion.form 
          onSubmit={(e) => e.preventDefault()}
          className={styles.wrapper}
          initial={{ opacity: 0, translateY: 70 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 70 }}
        >
          {showEmojiPicker && (
            <div 
              //initial={{ opacity: 0, scale: 0.6 }}
              //animate={{ opacity: 1, scale: 1 }}
              //exit={{ opacity: 0, scale: 0.5 }}
              className={styles.picker} 
              ref={emojiPickerRef}
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
            </div>
          )}
          <div className={styles.container}>
            <button
              onClick={handleEmojiModal}
            ><GrEmoji id='emoji-open' /></button>
            <input className={styles.input} value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={sendMessage}><BsSendFill /></button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
