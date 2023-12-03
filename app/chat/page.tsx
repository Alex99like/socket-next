'use client'

import { useSocket } from '@/providers/socket-provider'
import styles from './chat.module.scss'
import { Sidebar } from './components/sidebar/sidebar'
import { MessageBar } from './components/message-bar/message-bar'
import { ChatContainer } from './components/chat-container/chat-container'
import { useSupabase } from '@/providers/supabase-provider'
import { useEffect } from 'react'
import { HeaderChat } from './components/header/header-chat'
import toast, { Toaster } from 'react-hot-toast';

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
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            border: '1px solid #7b6147',
            padding: '7px',
            color: '#aa8259',
            backgroundColor: '#181818'
          }
        }}
      />
      <div className={styles.background} />
      <HeaderChat />
      <Sidebar />
      <ChatContainer />
      <MessageBar />
    </section>
  )
}

export default ChatPage