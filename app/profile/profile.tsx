'use client'

import { useEffect, useState } from 'react'
import { ImageUpload } from './components/image-upload/image-upload'
import styles from './profile.module.scss'
import { uploadFile } from '@/lib/supabase/api/client-file'
import { createSupabaseBrowerClient } from '@/lib/supabase/client'
import { IProfile } from '@/types/profile'
import { searchProfileClient, updateProfileClient } from '@/lib/supabase/client/profile'
import { LoadingAuth } from '@/components/shared/loading-auth/loading-auth'
import { AnimatePresence } from 'framer-motion'


export const Profile = () => {
  const [loading, setLoading] = useState(false)
  const [supabase] = useState(() => createSupabaseBrowerClient())
  const [profile, setProfile] = useState<IProfile | null>(null)

  const getProfile = async () => {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      const profile = await searchProfileClient(data.user)
      setProfile(profile)
    }
  }
  
  useEffect(() => {
    getProfile()
  }, [])
  // console.log(profile)
  const [image, setImage] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')

  const [imageURL, setImageURL] = useState<null | string>(null)

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
      setAbout(profile.about || '')

      if (profile.imageUrl) {
        const url = supabase.storage
          .from('avatar_img')
          .getPublicUrl(profile.imageUrl)
        setImageURL(url.data.publicUrl)
      }
    }
  }, [profile])

  const saveProfile = async () => {
    setLoading(true)
    const user = await supabase.auth.getUser()
    if (image && name && about && user.data.user) {
      const image_url = profile?.imageUrl || await uploadFile('avatar_image', image)
      
      const data = await updateProfileClient({
        id: profile?.id,
        name: name,
        about: about,
        imageUrl: image_url || '',
        user_id: user.data.user.id
      })

      setProfile(data)
    }
    setLoading(false)
  }
  
  return (
    <div className={styles.wrapper}>
      <AnimatePresence>
        {loading && <LoadingAuth />}
      </AnimatePresence>
      <h1 className={styles.title}>Профиль</h1>
      <ImageUpload upload={setImage} image={image} imageURL={imageURL} />
      <div className={styles.name}>
        <label>Ваше Имя</label>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className={styles.about}>
        <label>О Вас</label>
        <textarea 
          value={about} 
          onChange={(e) => setAbout(e.target.value)} 
        />
      </div>
      <button onClick={saveProfile}>Сохранить</button>
    </div>
  )
}
