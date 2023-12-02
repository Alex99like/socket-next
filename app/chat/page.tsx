'use client'

import { useSocket } from '@/providers/socket-provider'
import styles from './chat.module.scss'
import { Sidebar } from './components/sidebar/sidebar'
import { MessageBar } from './components/message-bar/message-bar'
import { ChatContainer } from './components/chat-container/chat-container'
import { useSupabase } from '@/providers/supabase-provider'
import { useEffect } from 'react'
import { HeaderChat } from './components/header/header-chat'

const ChatPage = () => {
  const { socket, onlineUsers } = useSocket()
  const { profile } = useSupabase()
  //console.log(onlineUsers)
  useEffect(() => {
    if (profile && socket) {
      socket.emit('add-user', profile.id)
    }
  }, [profile, socket])
 
  return (
    <section className={styles.wrapper}>
      <HeaderChat />
      <Sidebar />
      <ChatContainer />
      <MessageBar />
    </section>
  )
}

export default ChatPage