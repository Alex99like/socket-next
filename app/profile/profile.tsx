'use client'

import { useEffect, useState } from 'react'
import { ImageUpload } from './components/image-upload/image-upload'
import styles from './profile.module.scss'
import { uploadFile } from '@/lib/supabase/api/client-file'
import { createSupabaseBrowerClient } from '@/lib/supabase/client'
import { IProfile } from '@/types/profile'
import { searchProfileClient, updateProfileClient } from '@/lib/supabase/client/profile'


export const Profile = () => {
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
  console.log(profile)
  const [image, setImage] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')

  const saveProfile = async () => {
    if (image && name && about && profile) {
      const data = await uploadFile('avatar_image', image)
      
      updateProfileClient({
        id: profile.id,
        name: name,
        about: about,
        imageUrl: data?.path || ''
      })
    }
    
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Профиль</h1>
      <ImageUpload upload={setImage} image={image} />
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
