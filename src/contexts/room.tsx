'use client'
import { initializeApp } from 'firebase/app'
import type { User } from 'firebase/auth'
import {
  type Database,
  get,
  getDatabase,
  ref,
  remove,
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
  isLoading: boolean
  database: Database
  createRoom: (
    name: string,
    userName: string,
    points: string,
  ) => Promise<string>
  joinRoom: (code: string, userName: string) => Promise<void>
  leaveRoom: () => Promise<void>
  vote: (vote: string) => Promise<void>
  resetVotes: () => Promise<void>
  toggleRevealVotes: (show: boolean) => Promise<void>
}>({
  user: null,
  room: null,
  isLoading: true,
  database,
  createRoom: null as any,
  joinRoom: null as any,
  leaveRoom: null as any,
  vote: null as any,
  resetVotes: null as any,
  toggleRevealVotes: null as any,
})

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { room, isLoading, setRoom } = useRoom()

  const createRoom = useCallback(
    async (name: string, username: string, points: string) => {
      const code = generateRandomCode()

      sessionStorage.setItem(code, username)

      const newRoom = {
        code,
        name,
        points,
        showPoints: false,
        revealVotes: false,
        createdAt: new Date().toISOString(),
        ownerUid: user?.uid!,
        users: {
          [user?.uid!]: {
            uid: user?.uid!,
            name: username,
            vote: '',
          },
        },
      }

      await set(ref(database, `rooms/${code}`), newRoom)
      setRoom({
        ...newRoom,
        users: Object.values(newRoom.users),
      })

      return code
    },
    [user, setRoom],
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

      const existingUser = Object.entries(prevRoom.users || {}).find(
        (u: any) => u.uid === user.uid,
      )
      if (existingUser) {
        return
      }

      const userRef = ref(database, `rooms/${code}/users/${user.uid}`)

      const newUser = {
        uid: user.uid,
        name: username,
        vote: '',
      }

      await set(userRef, newUser)

      sessionStorage.setItem(code, username)
    },
    [user],
  )

  const leaveRoom = useCallback(async () => {
    if (!user || !room) {
      return
    }

    const userRef = ref(database, `rooms/${room.code}/users/${user.uid}`)

    const snapshot = await get(userRef)
    const prevUser = snapshot.val()

    if (!prevUser) {
      return
    }

    await remove(userRef)
    setRoom(null)
  }, [user, room, setRoom])

  const vote = useCallback(
    async (voteValue: string) => {
      if (!user) {
        throw new Error('User must be authenticated to vote')
      }

      const userRef = ref(database, `rooms/${room?.code}/users/${user.uid}`)

      const snapshot = await get(userRef)
      const prevUser = snapshot.val()

      if (!prevUser) {
        throw new Error('User does not exist')
      }

      await update(userRef, { ...prevUser, vote: voteValue })
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

    const updatedUsers = Object.fromEntries(
      Object.entries(prevRoom.users).map(([uid, userData]: [string, any]) => [
        uid,
        {
          ...userData,
          vote: '',
        },
      ]),
    )

    await update(roomRef, { users: updatedUsers })
  }, [room, user])

  const toggleRevealVotes = useCallback(
    async (show: boolean) => {
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
        throw new Error('Only the room owner can reveal votes')
      }

      await update(roomRef, { revealVotes: show })
    },
    [room, user],
  )

  const handleBeforeUnload = useCallback(async () => {
    await leaveRoom()
  }, [leaveRoom])

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handleBeforeUnload])

  return (
    <RoomContext.Provider
      value={{
        user,
        room,
        isLoading,
        database,
        createRoom,
        joinRoom,
        leaveRoom,
        vote,
        resetVotes,
        toggleRevealVotes,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}
