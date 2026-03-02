import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInAnonymously,
  type User,
  updateProfile,
} from 'firebase/auth'
import { useEffect, useState } from 'react'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    let cancelled = false

    const unsub = auth.onAuthStateChanged(async (firebaseUser) => {
      if (cancelled) return

      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        try {
          await setPersistence(auth, browserSessionPersistence)
          const cred = await signInAnonymously(auth)
          if (!cancelled) setUser(cred.user)
        } catch (e) {
          console.error('Failed to sign in anonymously:', e)
        }
      }
    })

    return () => {
      cancelled = true
      unsub()
    }
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
