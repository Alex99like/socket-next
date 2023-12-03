import { useEffect, useRef, useState } from 'react';
import styles from './voice-bar.module.scss'
import { FaTrash } from "react-icons/fa6";
import { useAudioRecorder } from 'react-audio-voice-recorder';
import cn from 'clsx'
import { FaPlayCircle, FaStopCircle, FaPlay, FaStop } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { motion } from 'framer-motion'
//@ts-ignore
import { LiveAudioVisualizer } from 'react-audio-visualize';

import { v4 as uuid } from 'uuid'
import WaveSurfer from "wavesurfer.js"
import { MessageSocket } from '@/types/message';
import { useSocket } from '@/providers/socket-provider';
import { IProfile } from '@/types/profile';
import { useChatStore } from '../../use-chat';
import { uploadFile } from '@/lib/supabase/api/client-file';
import { useSupabase } from '@/providers/supabase-provider';

export const VoiceBar = ({ close, profile }: { close: () => void, profile: IProfile | null }) => {
  const { 
    startRecording, 
    recordingTime, 
    recordingBlob, 
    isRecording,
    stopRecording,
    mediaRecorder,
  } = useAudioRecorder()
  const { socket } = useSocket()
  const { currentUser, setMessage } = useChatStore()
  const { supabase } = useSupabase()

  const [voice, setVoice] = useState<null | Blob>(null)
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const waveFormRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    recordingBlob && setVoice(recordingBlob)
    if (recordingBlob) {
      const audioURL = URL.createObjectURL(recordingBlob)
      setVoice(recordingBlob)
      
      waveform?.load(audioURL)
    }
  }, [recordingBlob])
  

  const startRecord = () => {
    setVoice(null)
    startRecording()
  } 

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current!,
      waveColor: '#ccc',
      progressColor: '#aa8259',
      cursorColor: "#7b6147",
      barWidth: 2,
      height: 30,
    })
    setWaveform(wavesurfer)

    // wavesurfer.on('finish', () => {
    //   setIsPlaying(false)
    // })

    return () => {
      wavesurfer.destroy()
    }
  }, [])
  
  const playVoice = () => {
    waveform?.play()
    setIsPlaying(false)
  }

  const pauseVoice = () => {
    waveform?.stop()
    setIsPlaying(true)
  }

  const sendVoiceMessage = async () => {
    if (recordingBlob) {
      const file = new File([recordingBlob], `audio-msg-${uuid()}`, { type: recordingBlob.type })
      close()
      if (file) {
        const audio = await uploadFile('audio-message', file)
        console.log(audio)
        if (currentUser && profile) {
          const id = uuid()
          socket?.emit('send-msg', {
            id,
            to: currentUser.id,
            from: profile.id,
            type: 'audio',
            message: audio,
            messageStatus: 'send'
          })
          setMessage({
            id,
            to: currentUser.id,
            from: profile.id,
            type: 'audio',
            message: audio || '',
            messageStatus: 'send',
            self: true
          })
          const data = await supabase.from('message').insert({
            id,
            to: currentUser.id,
            from: profile.id,
            type: 'audio',
            message: audio || '',
            messageStatus: 'send',
          })
        }
      }
      
    }
  }

  return (
    <motion.div 
      className={styles.wrapper}
      initial={{ opacity: 0, translateY: 70 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 70 }}
    >
      <div className={styles.container}>
        <button onClick={close}>
          <FaTrash />
        </button>
        {/* {voice && (
          <AudioVisualizer
            ref={visualizerRef}
            blob={voice}
            width={200}
            height={60}
            barWidth={2}
            gap={0.1}
            barColor={'#aa8259'}
          />
        )} */}
        {/* {mediaRecorder && (
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              width={200}
              height={75}
              barColor={'#aa8259'}
            />
          )} */}
        <div className={styles.record}>
          {mediaRecorder && (<>
            <div className={styles.live}>
              <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                width={250}
                className={styles.vizual}
                height={40}
                barColor={'#aa8259'}
              />
            </div>
            <span className={styles.time}>{recordingTime}</span>
          </>)}
          <div className={cn(styles['wive-container'], { [styles.active]: !!voice })}>
            <div ref={waveFormRef} className={styles.wave} />
            {isPlaying ? (
              <button onClick={playVoice}>
                <FaPlay />
              </button>
            ) : (
              <button onClick={pauseVoice}>
                <FaStop />
              </button>
            )}
            
          </div>
        </div>
        <div className={styles.control}>
          {voice ? (
            <button onClick={sendVoiceMessage}>
              <IoIosSend />
            </button>
          ) : (
            <>
              {isRecording ? (
                <button onClick={stopRecording}>
                  <FaStopCircle />
                </button>
              ) : (
                <button onClick={startRecord}>
                  <FaPlayCircle />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
