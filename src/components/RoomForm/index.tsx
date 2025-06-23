'use client'
import {
  Button,
  chakra,
  Field,
  Flex,
  HStack,
  Input,
  Separator,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { withMask } from 'use-mask-input'
import { useFirebase } from '~/hooks/useFirebase'
export function RoomForm() {
  const { createRoom } = useFirebase()
  const router = useRouter()

  function handleCreateRoom(ev: FormEvent<HTMLFormElement>) {
    const formData = new FormData(ev.currentTarget)
    const name = formData.get('roomName') as string
    const userName = formData.get('userName') as string
    const points = formData.get('points') as string

    if (!name || !points) {
      return
    }

    try {
      createRoom(name, userName, points)
    } catch (e) {
      console.error('Error creating room:', e)
    }
  }

  function handleJoinRoom(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const formData = new FormData(ev.currentTarget)

    router.push(`/room/${formData.get('code')}`)
  }

  return (
    <Flex
      w={{ base: '80vw', md: '50vw' }}
      direction='column'
      maxH='70vh'
      align='center'
      bgColor='white'
      overflowY='auto'
      gap={3}
      borderRadius='lg'
      shadow='xl'
      px={5}
      py={8}
    >
      <chakra.form
        display='flex'
        flexDir={'column'}
        w='full'
        gap={3}
        onSubmit={handleCreateRoom}
      >
        <Field.Root required>
          <Field.Label>Nome da sala</Field.Label>
          <Input name='roomName' placeholder='Escolha o nome da sala' />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Seu nome</Field.Label>
          <Input name='userName' placeholder='Digite o seu nome' />
        </Field.Root>

        <Field.Root required>
          <Field.Label>Pontuação</Field.Label>
          <Input
            name='points'
            placeholder='0,1,1.5,2,2.5,3,4,5'
            defaultValue={'0,1,1.5,2,2.5,3,4,5'}
          />
        </Field.Root>

        <Button
          w='fit'
          mx='auto'
          colorPalette='orange'
          px={10}
          size='md'
          style={{
            backgroundColor: '#DD6B20',
            fontWeight: 600,
            fontSize: 16,
            color: 'white',
          }}
          type='submit'
        >
          Criar sala
        </Button>
      </chakra.form>
      <HStack w={'40%'}>
        <Separator colorPalette='orange' flex='1' />
        <Text flexShrink='0'>ou</Text>
        <Separator flex='1' />
      </HStack>
      <chakra.form
        display='flex'
        flexDir='column'
        w='full'
        gap={3}
        onSubmit={handleJoinRoom}
      >
        <Field.Root required>
          <Field.Label>Código da sala</Field.Label>
          <Input
            name='code'
            ref={withMask('AAAA-AAAA')}
            placeholder='AAAA-BBBB'
          />
        </Field.Root>
        <Button
          w='fit'
          mx='auto'
          px={7}
          colorPalette='orange'
          variant='outline'
          size='md'
          style={{
            borderColor: '#DD6B20',
            fontWeight: 600,
            fontSize: 16,
            color: '#DD6B20',
          }}
          type='submit'
        >
          Entrar na sala
        </Button>
      </chakra.form>
    </Flex>
  )
}
