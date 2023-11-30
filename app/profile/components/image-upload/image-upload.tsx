import { useState } from "react"
import styles from './image-upload.module.scss'
import { IconSvg } from "./icon"
import Image from "next/image";

interface ImageUploadProps {
  upload: (file: File) => void
  image: File | null
  imageURL: string | null
}

export const ImageUpload = ({ upload, image, imageURL }: ImageUploadProps) => {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      upload(event.target.files[0]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <input type="file" onChange={handleFileChange} />
        {imageURL ? (
          <Image
            src={imageURL}
            alt="avatar"
            fill
          />
        ) : (
          <>
            {image ? (
              <Image 
                fill
                src={URL.createObjectURL(image)}
                style={{ objectFit: 'contain' }}
                alt="your-photo"
              />
            ) : (
              <div className={styles.content}>
                <IconSvg />
                <span>Загрузите Ваше Фото...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
