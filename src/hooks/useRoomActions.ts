import type { User } from 'firebase/auth'
import { get, ref, remove, set, update, type Database } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { generateRandomCode } from '~/helpers/randomCode'
import type { Room } from '~/models/room'

export function useRoomActions(
  database: Database,
  user: User | null,
  room: Room | null,
  setRoom: (room: Room | null) => void,
) {
  const router = useRouter()

  const createRoom = useCallback(
    async (name: string, username: string, points: string) => {
      if (!user) {
        throw new Error('User must be authenticated to create a room')
      }

      const code = generateRandomCode()

      sessionStorage.setItem(code, username)

      const newRoom = {
        code,
        name,
        points,
        showPoints: false,
        revealVotes: false,
        createdAt: new Date().toISOString(),
        ownerUid: user.uid,
        users: {
          [user.uid]: {
            uid: user.uid,
            name: username,
            vote: '',
            online: true,
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
    [user, database, setRoom],
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
        (u: any) => u[1].uid === user.uid,
      )
      if (existingUser) {
        // Re-entry (e.g. after refresh): update name & online status
        const userRef = ref(database, `rooms/${code}/users/${user.uid}`)
        await update(userRef, { name: username, online: true })
        sessionStorage.setItem(code, username)
        return
      }

      const userRef = ref(database, `rooms/${code}/users/${user.uid}`)

      const newUser = {
        uid: user.uid,
        name: username,
        vote: '',
        online: true,
      }

      await set(userRef, newUser)

      sessionStorage.setItem(code, username)
    },
    [user, database],
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
    router.push('/')
    setRoom(null)
  }, [user, room, database, setRoom, router])

  const vote = useCallback(
    async (voteValue: string) => {
      console.log('Vote action called with:', voteValue, { user, room })
      if (!user) {
        console.error('User must be authenticated to vote')
        throw new Error('User must be authenticated to vote')
      }
      if (!room) {
        console.error('Room not found')
        throw new Error('Room not found')
      }

      const userRef = ref(database, `rooms/${room.code}/users/${user.uid}`)

      try {
        const snapshot = await get(userRef)
        const prevUser = snapshot.val()
        console.log('PrevUser fetched:', prevUser)
        if (!prevUser) {
          console.error('User does not exist in room')
          throw new Error('User does not exist')
        }

        await update(userRef, { ...prevUser, vote: voteValue })
        console.log('Vote updated successfully')
      } catch (e) {
        console.error('Failed to update vote in Firebase:', e)
      }
    },
    [room, user, database],
  )

  const resetVotes = useCallback(async () => {
    if (!user) {
      throw new Error('User must be authenticated to reset votes')
    }
    if (!room) {
      throw new Error('Room not found')
    }

    const roomRef = ref(database, `rooms/${room.code}`)

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

    await update(roomRef, { users: updatedUsers, revealVotes: false })
  }, [room, user, database])

  const toggleRevealVotes = useCallback(
    async (show: boolean) => {
      if (!user) {
        throw new Error('User must be authenticated to reset votes')
      }
      if (!room) {
        throw new Error('Room not found')
      }

      const roomRef = ref(database, `rooms/${room.code}`)

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
    [room, user, database],
  )

  const transferOwnership = useCallback(
    async (newOwnerUid: string) => {
      if (!user) {
        throw new Error('User must be authenticated to transfer ownership')
      }
      if (!room) {
        throw new Error('Room not found')
      }

      const roomRef = ref(database, `rooms/${room.code}`)

      const snapshot = await get(roomRef)
      const prevRoom = snapshot.val()

      if (!prevRoom) {
        throw new Error('Room does not exist')
      }

      if (prevRoom.ownerUid !== user.uid) {
        throw new Error('Only the room owner can transfer ownership')
      }

      const targetUser = Object.values(prevRoom.users || {}).find(
        (u: any) => u.uid === newOwnerUid,
      )
      if (!targetUser) {
        throw new Error('Target user is not in the room')
      }

      await update(roomRef, { ownerUid: newOwnerUid })
    },
    [room, user, database],
  )

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    vote,
    resetVotes,
    toggleRevealVotes,
    transferOwnership,
  }
}
