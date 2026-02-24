import {
  getAuth,
  signInAnonymously,
  updateProfile,
  type User,
} from 'firebase/auth'
import { useEffect, useState } from 'react'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    signInAnonymously(auth).then((user) => {
      setUser(user.user)
    })
  }, [])

  useEffect(() => {
    const auth = getAuth()

    const unsub = auth.onAuthStateChanged((user) => setUser(user ?? null))

    return () => unsub()
  }, [])

  const updateUserProfile = async (displayName: string) => {
    const auth = getAuth()
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName })
      setUser({ ...auth.currentUser }) // Force re-render
    }
  }

  return { user, updateUserProfile }
}
