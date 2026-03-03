'use client'
import { type FirebaseApp, initializeApp } from 'firebase/app'
import type { User } from 'firebase/auth'
import {
  type Database,
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  update,
} from 'firebase/database'
import { createContext, useCallback, useEffect, useMemo } from 'react'
import { firebaseConfig } from '~/config'
import { useRoom } from '~/hooks/useRoom'
import { useRoomActions } from '~/hooks/useRoomActions'
import { useUser } from '~/hooks/useUser'
import type { Room } from '~/models/room'

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
  transferOwnership: (newOwnerUid: string) => Promise<void>
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
  transferOwnership: null as any,
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
    transferOwnership,
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

  // ─── Presence via .info/connected
  // Firebase's .info/connected fires after each new connection is established.
  // Sequence on refresh: old onDisconnect fires → new connection → this listener
  // sets onDisconnect then online:true, so online:true always wins.
  const userInRoom = room?.users?.some((u) => u.uid === user?.uid) ?? false

  useEffect(() => {
    if (!database || !user || !room?.code || !userInRoom) return

    const userRef = ref(database, `rooms/${room.code}/users/${user.uid}`)
    const connectedRef = ref(database, '.info/connected')

    const unsub = onValue(connectedRef, (snap) => {
      if (snap.val() !== true) return

      // 1. Register onDisconnect FIRST
      onDisconnect(userRef)
        .update({ online: false })
        .then(() => {
          // 2. THEN set online — guarantees proper ordering
          update(userRef, { online: true })
        })
    })

    return () => unsub()
  }, [database, user?.uid, room?.code, userInRoom, user])

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
        transferOwnership,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}
