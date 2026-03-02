'use client'
import { Button, chakra, Field, Flex, Input } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { withMask } from 'use-mask-input'

export function JoinRoomForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleJoinRoom(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const formData = new FormData(ev.currentTarget)
    const code = formData.get('code') as string

    if (!code) {
      return
    }

    setLoading(true)
    router.push(`/room/${code}`)
  }

  return (
    <Flex w='full' direction='column' align='center' gap={3}>
      <chakra.form
        display='flex'
        flexDir='column'
        w='full'
        gap={3}
        onSubmit={handleJoinRoom}
      >
        <Field.Root required textAlign='center' justifyContent='center'>
          <Field.Label textAlign='center' mx='auto'>
            Código da sala
          </Field.Label>
          <Input
            name='code'
            ref={withMask('AAAA-AAAA')}
            placeholder='AAAA-BBBB'
            textAlign='center'
          />
        </Field.Root>
        <Button
          w='fit'
          mx='auto'
          px={7}
          colorPalette='orange'
          variant='outline'
          style={{
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)',
          }}
          fontWeight='600'
          fontSize='md'
          size='md'
          loading={loading}
          type='submit'
        >
          Entrar na sala
        </Button>
      </chakra.form>
    </Flex>
  )
}
