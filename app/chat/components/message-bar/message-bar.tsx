import { ChangeEvent, useEffect, useRef, useState } from 'react'
import styles from './message-bar.module.scss'
import { BsSendFill } from "react-icons/bs";
import { useSocket } from '@/providers/socket-provider';
import { v4 as uuid } from 'uuid'
import { useChatStore } from '../../use-chat';
import { AnimatePresence, motion } from 'framer-motion';
import { useSupabase } from '@/providers/supabase-provider';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { GrEmoji } from "react-icons/gr";
import { IoMdPhotos } from "react-icons/io";
import { uploadFile } from '@/lib/supabase/api/client-file';

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

  const sendImageMessage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const img = await uploadFile('message_img', file)
      if (currentUser && profile) {
        const id = uuid()
        socket?.emit('send-msg', {
          id,
          to: currentUser.id,
          from: profile.id,
          type: 'image',
          message: img,
          messageStatus: 'send'
        })
        setMessage({
          id,
          to: currentUser.id,
          from: profile.id,
          type: 'image',
          message: img || '',
          messageStatus: 'send'
        })
        setValue('')
      }
    }
  }
  
  const sendMessage = () => {
    if (currentUser && profile) {
      const id = uuid()
      socket?.emit('send-msg', {
        id,
        to: currentUser.id,
        from: profile.id,
        type: 'text',
        message: value,
        messageStatus: 'send'
      })
      setMessage({
        id,
        to: currentUser.id,
        from: profile.id,
        type: 'text',
        message: value,
        messageStatus: 'send'
      })
      setValue('')
    }
  }
  
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
            <button
              onClick={handleEmojiModal}
            >
              <IoMdPhotos />
              <input type='file' className={styles.file} onChange={sendImageMessage} />
            </button>
            <input className={styles.input} value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={sendMessage}><BsSendFill /></button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
