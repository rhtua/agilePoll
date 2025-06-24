import { onValue, ref } from 'firebase/database'
import { useParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { RoomContext } from '~/contexts/room'
import type { Room } from '~/models/room'

export function useRoom() {
  const ctx = useContext(RoomContext)

  const { room: roomCode } = useParams()
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    if (!roomCode) return

    const roomRef = ref(ctx.database, `rooms/${roomCode}`)

    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val()

      setRoom(data || null)
    })

    return () => unsub()
  }, [roomCode, ctx.database])

  return { room }
}
