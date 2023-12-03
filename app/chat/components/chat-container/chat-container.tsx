import { useSupabase } from "@/providers/supabase-provider"
import { useChatStore } from "../../use-chat"
import styles from './chat-container.module.scss'
import cn from 'clsx'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { MessageText } from "../message/message"
import { MessageImage } from "../message/message-image"
import MessageVoice from "../message/message-voice"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { MessageSocket } from "@/types/message"

//const MessageVoice = dynamic(() => import('../message/message-voice'), { ssr: false })

export const ChatContainer = () => {
  const { message } = useChatStore()
  const { profile, supabase } = useSupabase()
  const { currentUser, setAllMessages } = useChatStore()
  const [chatMessages, setChatMessages] = useState<MessageSocket[]>([])
  
  const getData = async () => {
    setChatMessages([])
    if (currentUser && profile) {
      let result1 = await supabase
        .from('message')
        .select('*')
        .eq('from', profile?.id)
        .eq('to', currentUser?.id)
      
      let result2 = await supabase
        .from('message')
        .select('*')
        .eq('from', currentUser?.id)
        .eq('to', profile?.id)
      
      if (result1.data && result2.data) {
        let data = [...result1.data, ...result2.data, ...message];
        let uniqueArray = Array.from(new Set(data.map(a => a.id)))
          .map(id => {
            return data.find(a => a.id === id)
         });

         setChatMessages(uniqueArray as MessageSocket[])
      }
    }
  }

  useEffect(() => {
    const arr = message.filter(el =>
      el.from === profile?.id && el.to === currentUser?.id ||
      el.to === profile?.id && el.from === currentUser?.id 
    )
    let data = [...chatMessages, ...arr];
    let uniqueArray = Array.from(new Set(data.map(a => a.id)))
      .map(id => {
        return data.find(a => a.id === id)
     });

     setChatMessages(uniqueArray as MessageSocket[])
  
  }, [message])

  useEffect(() => {
    getData()
  }, [currentUser])

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });  
  }, [chatMessages])

  // const handle = () => {
  //   const arr = message.filter(el =>
  //     el.from === profile?.id && el.to === currentUser?.id ||
  //     el.to === profile?.id && el.from === currentUser?.id 
  //   ).map(({ id }) => id)
  
  //   if (arr.length) {
  //     setAllMessages(message.map((msg) => {
  //       if (arr.includes(msg.id)) {
  //         return { ...msg, messageStatus: 'success' }
  //       } else {
  //         return msg
  //       }
  //     }))
  //   }    
  // }

  // useEffect(() => {
  //   handle()
  // }, [currentUser])
  
  return (
    <div className={styles.wrapper}>
      <LayoutGroup>
        {chatMessages.map((msg) => {
          if (msg.type === 'text') return <MessageText msg={msg} profileId={profile?.id} />
          if (msg.type === 'image') return <MessageImage msg={msg} profileId={profile?.id} />
          if (msg.type === 'audio') return <MessageVoice msg={msg} profileId={profile?.id} />
        })}
      </LayoutGroup>
    </div>
  )
}
