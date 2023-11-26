import Image from 'next/image'
import styles from './page.module.css'
import { FormEvent, useEffect, useState } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client'
import { SocketProvider } from '@/providers/socket-provider';
import { Chat } from '@/components/chat/chat';


export default function Home() {
  return (
    <main className={styles.main}>
      <SocketProvider>
        <Chat />
      </SocketProvider>
    </main>
  )
}
