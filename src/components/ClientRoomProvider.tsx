'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

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
