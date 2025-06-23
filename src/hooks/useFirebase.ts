'use client'
import type { Analytics } from 'firebase/analytics'
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth, type User } from 'firebase/auth'
import { getDatabase, onValue, ref, set } from 'firebase/database'
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

  function createRoom(name: string, username: string, points: string) {
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
  }

  function getRoomRef(code: string) {
    const roomRef = ref(database, `rooms/${code}`)

    return roomRef
  }

  function joinRoom(code: string, username: string) {
    if (!user) {
      throw new Error('User must be authenticated to join a room')
    }

    const roomRef = ref(database, `rooms/${code}`)

    set(roomRef, (prevRoom: any) => {
      if (!prevRoom) {
        throw new Error('Room does not exist')
      }

      const updatedUsers = [
        ...(prevRoom.users || []),
        { uid: user.uid, name: username, vote: '' },
      ]
      return { ...prevRoom, users: updatedUsers }
    })
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
  }, [])

  return { app, analytics, user, createRoom, joinRoom, getRoomRef, room }
}
