import { onValue, ref } from 'firebase/database'
import { useParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { RoomContext } from '~/contexts/room'
import type { Room } from '~/models/room'

export function useRoom() {
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
      setRoom(data || null)
      setIsLoading(false)
    })

    return () => unsub()
  }, [roomCode, ctx.database, room])

  return { room, isLoading }
}
