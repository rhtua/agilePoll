'use client'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import type { User } from 'firebase/auth'
import { getDatabase, type Database } from 'firebase/database'
import { createContext, useCallback, useEffect, useMemo } from 'react'
import { firebaseConfig } from '~/config'
import { useRoom } from '~/hooks/useRoom'
import { useRoomActions } from '~/hooks/useRoomActions'
import { useUser } from '~/hooks/useUser'
import type { Room } from '~/models/room'

// Lazy singleton – only initialized on the client (inside RoomProvider)
let _app: FirebaseApp | null = null
let _database: Database | null = null

function getFirebase() {
  if (!_app) {
    _app = initializeApp(firebaseConfig)
    _database = getDatabase(_app)
  }
  return _database!
}

export const RoomContext = createContext<{
  user: User | null
  room: Room | null
  isLoading: boolean
  database: Database | null
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
  database: null,
  createRoom: null as any,
  joinRoom: null as any,
  leaveRoom: null as any,
  vote: null as any,
  resetVotes: null as any,
  toggleRevealVotes: null as any,
})

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const database = useMemo(() => getFirebase(), [])
  const { user, updateUserProfile } = useUser()
  const { room, isLoading, setRoom } = useRoom(database)

  const {
    createRoom: _createRoom,
    joinRoom: _joinRoom,
    leaveRoom,
    resetVotes,
    toggleRevealVotes,
    vote,
  } = useRoomActions(database, user, room, setRoom)

  const createRoom = useCallback(
    async (name: string, userName: string, points: string) => {
      await updateUserProfile(userName)
      return _createRoom(name, userName, points)
    },
    [updateUserProfile, _createRoom],
  )

  const joinRoom = useCallback(
    async (code: string, userName: string) => {
      await updateUserProfile(userName)
      return _joinRoom(code, userName)
    },
    [updateUserProfile, _joinRoom],
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
