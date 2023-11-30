import { IProfile } from "@/types/profile"
import styles from './sidebar.module.scss'
import Image from "next/image"
import cn from 'clsx'

export const ItemPerson = ({ profile, image }: { profile: IProfile, image: string }) => {
  return (
    <div className={styles.item}>
      <Image
        src={image}
        alt="Avatar"
        width={40}
        height={40}
        className={styles.image}
      />
      {profile.name}

      <div className={styles.status}>
        <span>offline</span>
        <b />
      </div>
    </div>
  )
}
