'use client'
import { initializeApp } from 'firebase/app'
import type { User } from 'firebase/auth'
import {
  type Database,
  get,
  getDatabase,
  ref,
  set,
  update,
} from 'firebase/database'
import { createContext, useCallback, useEffect } from 'react'
import { firebaseConfig } from '~/config'
import { generateRandomCode } from '~/helpers/randomCode'
import { useRoom } from '~/hooks/useRoom'
import { useUser } from '~/hooks/useUser'
import type { Room } from '~/models/room'

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const RoomContext = createContext<{
  user: User | null
  room: Room | null
  database: Database
  createRoom: (
    name: string,
    userName: string,
    points: string,
  ) => Promise<string>
  joinRoom: (code: string, userName: string) => Promise<void>
  leaveRoom: (code: string) => Promise<void>
  vote: (vote: string) => Promise<void>
  resetVotes: () => Promise<void>
}>({
  user: null,
  room: null,
  database,
  createRoom: null as any,
  joinRoom: null as any,
  leaveRoom: null as any,
  vote: null as any,
  resetVotes: null as any,
})

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { room } = useRoom()

  const createRoom = useCallback(
    async (name: string, username: string, points: string) => {
      const code = generateRandomCode()

      set(ref(database, `rooms/${code}`), {
        code,
        name,
        points,
        createdAt: new Date().toISOString(),
        ownerUid: user?.uid,
        users: [
          {
            uid: user?.uid || '',
            name: username,
            vote: '',
          },
        ],
      })

      return code
    },
    [user],
  )

  const joinRoom = useCallback(
    async (code: string, username: string) => {
      if (!user) {
        throw new Error('User must be authenticated to join a room')
      }

      const roomRef = ref(database, `rooms/${code}`)

      const snapshot = await get(roomRef)
      const prevRoom = snapshot.val()

      if (!prevRoom) {
        throw new Error('Room does not exist')
      }

      const existingUser = prevRoom.users?.find((u: any) => u.uid === user.uid)
      if (existingUser) {
        return
      }

      const updatedUsers = [
        ...(prevRoom.users || []),
        { uid: user.uid, name: username, vote: '' },
      ]

      await update(roomRef, { users: updatedUsers })
    },
    [user],
  )

  const leaveRoom = useCallback(
    async (code: string) => {
      if (!user) {
        return
      }

      const roomRef = ref(database, `rooms/${code}`)

      const snapshot = await get(roomRef)
      const prevRoom = snapshot.val()

      if (!prevRoom || !prevRoom.users) {
        return
      }

      const updatedUsers =
        prevRoom.users.filter((u: any) => u.uid !== user.uid) ?? []

      await update(roomRef, { users: updatedUsers })
    },
    [user],
  )

  const vote = useCallback(
    async (voteValue: string) => {
      if (!user) {
        throw new Error('User must be authenticated to vote')
      }

      const roomRef = ref(database, `rooms/${room!.code}`)

      const snapshot = await get(roomRef)
      const prevRoom = snapshot.val()

      if (!prevRoom) {
        throw new Error('Room does not exist')
      }

      if (!prevRoom.users) {
        throw new Error('No users in room')
      }

      const userIndex = prevRoom.users.findIndex((u: any) => u.uid === user.uid)

      if (userIndex === -1) {
        throw new Error('User is not in this room')
      }

      const updatedUsers = [...prevRoom.users]
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        vote: voteValue,
      }

      await update(roomRef, { users: updatedUsers })
    },
    [room, user],
  )

  const resetVotes = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated to reset votes')
    }

    const roomRef = ref(database, `rooms/${room!.code}`)

    const snapshot = await get(roomRef)
    const prevRoom = snapshot.val()

    if (!prevRoom) {
      throw new Error('Room does not exist')
    }

    if (!prevRoom.users) {
      throw new Error('No users in room')
    }

    if (prevRoom.ownerUid !== user.uid) {
      throw new Error('Only the room owner can reset votes')
    }

    const updatedUsers = prevRoom.users.map((u: any) => ({
      ...u,
      vote: '',
    }))

    await update(roomRef, { users: updatedUsers })
  }, [room, user])

  useEffect(() => {
    async function handleBeforeUnload() {
      if (room) {
        await leaveRoom(room.code)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
  }, [leaveRoom, room])

  return (
    <RoomContext.Provider
      value={{
        user,
        room,
        database,
        createRoom,
        joinRoom,
        leaveRoom,
        vote,
        resetVotes,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}
