'use client'

import { useSocket } from "@/providers/socket-provider"
import { useSupabase } from "@/providers/supabase-provider"
import { IProfile } from "@/types/profile"
import { useEffect, useState } from "react"
import styles from './sidebar.module.scss'
import { ItemPerson } from "./item"
import Image from "next/image"
import { IoCloseCircleOutline } from "react-icons/io5";
import { AnimatePresence, motion } from 'framer-motion'

export const Sidebar = () => {
  const { profile, supabase } = useSupabase()
  const { socket } = useSocket()

  const [active, setActive] = useState(false)
 
  const [allProfiles, setAllProfiles] = useState<IProfile[]>([])

  const getAllProfiles = async () => {
    const { data } = await supabase.from('profile').select()
    data && setAllProfiles(data)
  }

  useEffect(() => {
    getAllProfiles()
  }, [])

  return (
    <>
      <button className={styles.burger} onClick={() => setActive(true)}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <AnimatePresence>
      {active && (
        <motion.div 
          className={styles.wrapper}
          initial={{ translateX: -240 }}
          animate={{ translateX: 0 }}
          exit={{ translateX: -240 }}
          transition={{ type: 'tween' }}
        >
          <button className={styles.close} onClick={() => setActive(false)}><IoCloseCircleOutline /></button>
          <div className={styles.avatar}>
            <Image
              src={supabase.storage.from('avatar_img').getPublicUrl(profile?.imageUrl || '').data.publicUrl}
              alt="avatar"
              width={40}
              height={40}
              style={{ objectFit: 'cover' }}
              className={styles.image}
            />
            <h4>{profile?.name}</h4>
          </div>
          {allProfiles.filter(el => el.id !== profile?.id).map((prof) => (
            <ItemPerson 
              key={prof.id}
              profile={prof} 
              image={supabase.storage.from('avatar_img').getPublicUrl(prof.imageUrl || '').data.publicUrl}
            />
          ))}
        </motion.div>
      )}
      </AnimatePresence>
    </>
  )
}
