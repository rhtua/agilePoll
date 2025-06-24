import type { FormEvent } from 'react'
import { toaster } from '../ui/toaster'

export async function handleCreateRoom(ev: FormEvent<HTMLFormElement>) {
  ev.preventDefault()
  const formData = new FormData(ev.currentTarget)
  const name = formData.get('roomName') as string
  const userName = formData.get('userName') as string
  const points = formData.get('points') as string

  if (!name || !points) {
    return
  }

  try {
    setLoading('create')
    const roomCode = await createRoom(name, userName, points)
    router.push(`/room/${roomCode}`)
  } catch (e) {
    console.error('Error creating room:', e)
    setLoading(undefined)
  }
}

export async function handleJoinRoom(
  ev: FormEvent<HTMLFormElement>,
  setLoading: (state: 'join' | 'create' | undefined) => void,
) {
  ev.preventDefault()
  const formData = new FormData(ev.currentTarget)
  const code = formData.get('code') as string
  const userName = formData.get('userName') as string

  if (!userName || !code) {
    return
  }

  try {
    setLoading('join')
    await joinRoom(code, userName)
  } catch (e) {
    toaster.create({
      title: 'Erro ao entrar na sala',
      description: 'Verifique o código e tente novamente.',
      type: 'error',
    })

    setLoading(undefined)
    console.log('returning from joinRoom')
    console.error('Error joining room:', e)
    return
  }

  router.push(`/room/${code}`)
}
