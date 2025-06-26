import { onValue, ref } from 'firebase/database'
import { useParams, useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { toaster } from '~/components/ui/toaster'
import { RoomContext } from '~/contexts/room'
import type { Room } from '~/models/room'

export function useRoom() {
  const router = useRouter()
  const ctx = useContext(RoomContext)

  const { room: roomCode } = useParams()
  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!roomCode) {
      setIsLoading(false)
      return
    }
    if (!room) setIsLoading(true)
    const roomRef = ref(ctx.database, `rooms/${roomCode}`)

    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val()

      const mappedData: Room | null = data
        ? {
            ...data,
            users: Object.values(data?.users || {}),
          }
        : null

      setRoom(mappedData)
      setIsLoading(false)

      if (!data) {
        router.push('/')
        toaster.create({
          title: 'Sala não encontrada',
          description:
            'A sala que você está tentando acessar não existe ou foi removida.',
          type: 'error',
        })
      }
    })

    return () => unsub()
  }, [roomCode, ctx.database, room, router.push])

  return { room, isLoading, setRoom }
}
