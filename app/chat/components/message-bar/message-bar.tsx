import { useState } from 'react'
import styles from './message-bar.module.scss'
import { BsSendFill } from "react-icons/bs";
import { useSocket } from '@/providers/socket-provider';

export const MessageBar = () => {
  const [] = useState()
  const { socket, onlineUsers } = useSocket()
  console.log(socket)


  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <input className={styles.input} />
        <button><BsSendFill /></button>
      </div>
    </div>
  )
}
