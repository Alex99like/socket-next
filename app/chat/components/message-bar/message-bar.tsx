import { useState } from 'react'
import styles from './message-bar.module.scss'
import { BsSendFill } from "react-icons/bs";
import { useSocket } from '@/providers/socket-provider';
import { io } from 'socket.io-client';

export const MessageBar = () => {
  const [value, setValue] = useState('')
  const { socket, onlineUsers } = useSocket()
  
  const handle = () => {
    socket?.emit('event', value)
  }
  

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <input className={styles.input} value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={(handle)}><BsSendFill /></button>
      </div>
    </div>
  )
}
