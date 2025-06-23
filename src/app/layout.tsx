import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import { Provider } from '~/components/ui/provider'
import './global.css'
import { Button, Flex, HStack, Spacer } from '@chakra-ui/react'
import Image from 'next/image'
import { AiOutlineUserAdd } from 'react-icons/ai'
import PageLayout from '~/components/PageLayout'

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AgilePoll',
  description: 'Planning Poker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body className={urbanist.className}>
        <Provider>
          <PageLayout>{children}</PageLayout>
        </Provider>
      </body>
    </html>
  )
}
