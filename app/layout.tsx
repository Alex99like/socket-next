import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import '@/app/styles/global.scss'

const inter = Manrope({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
})
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
