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
import { TiMicrophoneOutline } from "react-icons/ti";
import { VoiceBar } from '../voice-bar/voice-bar';

export const MessageBar = () => {
  const [value, setValue] = useState('')
  const { profile } = useSupabase()
  const { socket, onlineUsers, actionWrite } = useSocket()
  const { currentUser, setMessage } = useChatStore()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [handleVoice, setHandleVoice] = useState(false)

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

  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (currentUser && profile) {
      socket?.emit('msg-handle', {
        to: currentUser.id,
        from: profile.id,
        active: true
      })
    }
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
          messageStatus: 'send',
          self: true
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
      socket?.emit('msg-handle', {
        to: currentUser.id,
        from: profile.id,
        active: false
      })
      setMessage({
        id,
        to: currentUser.id,
        from: profile.id,
        type: 'text',
        message: value,
        messageStatus: 'send',
        self: true
      })
      setValue('')
    }
  }
  
  return (
    <AnimatePresence>
      {actionWrite && actionWrite?.from === currentUser?.id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <span className={styles.write}>
            {currentUser?.name} Вам пишет...
          </span>
        </motion.div>
      )}
      {currentUser && !handleVoice && (
        <motion.form 
          onSubmit={(e) => {
            e.preventDefault()
            value.length && sendMessage()
          }}
          key={'message-bar'}
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
            {!value.length && (
              <button>
                <IoMdPhotos />
                <input type='file' className={styles.file} onChange={sendImageMessage} />
              </button>
            )}
            
            <input className={styles.input} value={value} onChange={onChangeValue} />
            
            {value.length ? (
              <button onClick={sendMessage}><BsSendFill /></button>
            ) : (
              <button onClick={() => setHandleVoice(true)}>
                <TiMicrophoneOutline />
              </button>
            )}
          </div>
        </motion.form>
      )}
      {currentUser && handleVoice && (
        <VoiceBar key={'voice-bar'} close={() => setHandleVoice(false)} profile={profile} />
      )}
    </AnimatePresence>
  )
}
