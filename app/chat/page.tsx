'use client'

import { useSocket } from '@/providers/socket-provider'
import styles from './chat.module.scss'
import { Sidebar } from './components/sidebar/sidebar'
import { MessageBar } from './components/message-bar/message-bar'
import { ChatContainer } from './components/chat-container/chat-container'
import { useSupabase } from '@/providers/supabase-provider'
import { useEffect } from 'react'

const ChatPage = () => {
  const { socket, onlineUsers } = useSocket()
  const { profile } = useSupabase()
  console.log(onlineUsers)
  useEffect(() => {
    if (profile && socket) {
      socket.emit('online-user', profile.id)
    }
  }, [profile, socket])
 

  return (
    <section className={styles.wrapper}>
      <Sidebar />
      <ChatContainer />
      <MessageBar />
    </section>
  )
}

export default ChatPage