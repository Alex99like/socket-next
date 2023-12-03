import { MessageSocket } from "@/types/message"
import { motion } from 'framer-motion'
import cn from 'clsx'
import styles from './message.module.scss'
import Image from "next/image"
import { useSupabase } from "@/providers/supabase-provider"
import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import { FaPlay, FaStop } from "react-icons/fa6";

const MessageVoice = ({ msg, profileId }: { msg: MessageSocket, profileId: string | undefined }) => {
  const { supabase } = useSupabase()  
  const from = profileId === msg.from
  
    
  const [audioMessage, setAudioMessage] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)

  const waveFormRef = useRef(null)
  const waveform = useRef<WaveSurfer>()

  useEffect(() => {
    
    waveform.current = WaveSurfer.create({
      container: waveFormRef.current!,
      waveColor: '#ccc',
      progressColor: from ? '#c5996d' : '#191919',
      cursorColor: from ? '#956d45' : '#010101',
      barWidth: 2,
      height: 30,
    })

    waveform.current.on('finish', () => {
      setIsPlaying(false)
    })

    return () => {
      waveform.current?.destroy()
    }
  }, [])

  useEffect(() => {
    const audioUrl = supabase.storage
      .from('audio-message')
      .getPublicUrl(msg.message).data.publicUrl
      
    const audio = new Audio(audioUrl)
    setAudioMessage(audio)

    waveform.current?.load(audioUrl)
    waveform.current?.on('ready', () => {
      setTotalDuration(waveform.current!.getDuration())
    })
  }, [])
  
  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(audioMessage.currentTime)
      }
      audioMessage.addEventListener('timeupdate', updatePlaybackTime)
      return () => {
        audioMessage.removeEventListener('timeupdate', updatePlaybackTime)
      }
    }
  }, [audioMessage])

  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current?.stop()
      waveform.current?.play()
      audioMessage.play()
      setIsPlaying(true)
    }
  }

  const handlePauseAudio = () => {
    waveform.current?.stop()
    audioMessage?.pause()
    setIsPlaying(false)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')
    }`
  }

  return (
    <motion.div 
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      className={cn(styles.container, {
        [styles.from]: !from,
        [styles.to]: from
      })} 
      key={msg.message}
    >
      <div className={styles.message}>
        <div className={styles.record}>
          <div className={cn(styles.control, {
            [styles.from]: !from,
            [styles.to]: from
          })}>
            {isPlaying ? (
              <button onClick={handlePauseAudio}>
                <FaStop />
              </button>
            ) : (
              <button onClick={handlePlayAudio}>
                <FaPlay />
              </button>
            )}
          </div>
          <div ref={waveFormRef} className={styles.wave} />
        </div>
      </div> 
    </motion.div>
  )
}

export default MessageVoice