'use client'
import type { Analytics } from 'firebase/analytics'
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, type User } from 'firebase/auth'
import { get, getDatabase, onValue, ref, set, update } from 'firebase/database'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Room } from '~/models/room'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export function useFirebase() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const app = initializeApp(firebaseConfig)
  const database = getDatabase(app)

  const { room: roomCode } = useParams()

  const [user, setUser] = useState<User | null>(null)
  const [room, setRoom] = useState<Room | null>(null)

  async function signInUser() {
    const auth = getAuth()
    try {
      await signInAnonymously(auth)
      const currentUser = auth.currentUser
      if (currentUser) {
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  async function createRoom(name: string, username: string, points: string) {
    const array = new Uint8Array(8)
    window.crypto.getRandomValues(array)
    const roomCode = Array.from(array, (byte) =>
      String.fromCharCode(65 + (byte % 26)),
    ).join('')

    const code = `${roomCode.slice(0, 4)}-${roomCode.slice(4)}`

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
  }

  function getRoomRef(code: string) {
    const roomRef = ref(database, `rooms/${code}`)

    return roomRef
  }

  async function joinRoom(code: string, username: string) {
    if (!user) {
      throw new Error('User must be authenticated to join a room')
    }

    const roomRef = ref(database, `rooms/${code}`)

    try {
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
    } catch (error) {
      console.error('Error joining room:', error)
    }
  }

  async function leaveRoom(code: string) {
    if (!user) {
      return
    }

    const roomRef = ref(database, `rooms/${code}`)

    try {
      const snapshot = await get(roomRef)
      const prevRoom = snapshot.val()

      if (!prevRoom || !prevRoom.users) {
        return
      }

      const updatedUsers = prevRoom.users.filter((u: any) => u.uid !== user.uid)

      if (updatedUsers.length === 0) {
        await set(roomRef, null)
      } else {
        await update(roomRef, { users: updatedUsers })
      }
    } catch (error) {
      console.error('Error leaving room:', error)
    }
  }

  async function vote(voteValue: string) {
    if (!user) {
      throw new Error('User must be authenticated to vote')
    }

    const roomRef = ref(database, `rooms/${roomCode}`)

    try {
      const snapshot = await get(roomRef)
      const prevRoom = snapshot.val()

      if (!prevRoom) {
        throw new Error('Room does not exist')
      }

      if (!prevRoom.users) {
        throw new Error('No users in room')
      }
      console.log(prevRoom)
      console.log(user)
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
    } catch (error) {
      console.error('Error voting:', error)
      throw error
    }
  }

  async function resetVotes() {
    if (!user) {
      throw new Error('User must be authenticated to reset votes')
    }

    const roomRef = ref(database, `rooms/${roomCode}`)

    try {
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
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    if (!roomCode) return

    const roomRef = ref(database, `rooms/${roomCode}`)

    const unsub = onValue(roomRef, (snapshot) => {
      const data = snapshot.val()

      setRoom(data || null)
    })

    return () => unsub()
  }, [roomCode, database])

  useEffect(() => {
    if (window) {
      setAnalytics(getAnalytics(app))
    }
  }, [app])

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [signInUser])

  useEffect(() => {
    if (!roomCode || !user) return

    const handleBeforeUnload = () => {
      try {
        leaveRoom(roomCode as string)
      } catch (error) {
        console.error('Error during beforeunload cleanup:', error)
      }
    }

    const handleUnload = () => {
      leaveRoom(roomCode as string).catch(console.error)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)

      if (roomCode && user) {
        leaveRoom(roomCode as string).catch(console.error)
      }
    }
  }, [roomCode, user])

  return {
    app,
    analytics,
    user,
    room,
    createRoom,
    joinRoom,
    getRoomRef,
    signInUser,
    leaveRoom,
    vote,
    resetVotes,
  }
}
