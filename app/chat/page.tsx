'use client'

import { useSocket } from '@/providers/socket-provider'
import styles from './chat.module.scss'
import { Sidebar } from './components/sidebar/sidebar'
import { MessageBar } from './components/message-bar/message-bar'
import { ChatContainer } from './components/chat-container/chat-container'
import { useSupabase } from '@/providers/supabase-provider'
import { useEffect } from 'react'

const ChatPage = () => {
  const { socket } = useSocket()
  const { profile } = useSupabase()
  
  useEffect(() => {
    if (profile) {
      socket?.emit('add-user', profile.id)
    }
  }, [profile])
 

  return (
    <section className={styles.wrapper}>
      <Sidebar />
      <ChatContainer />
      <MessageBar />
    </section>
  )
}

export default ChatPage