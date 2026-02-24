'use client'

import dynamic from 'next/dynamic'
import { Flex, Spinner, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

const FirebaseRoomProvider = dynamic(
  () => import('~/contexts/room').then((mod) => mod.RoomProvider),
  {
    ssr: false, 
  },
)

export default function ClientRoomProvider({
  children,
}: {
  children: ReactNode
}) {
  return <FirebaseRoomProvider>{children}</FirebaseRoomProvider>
}
