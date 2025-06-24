import {
  Button,
  chakra,
  Field,
  Flex,
  HStack,
  Input,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { type FormEvent, use, useCallback, useEffect, useState } from 'react'
import { RoomContext } from '~/contexts/room'
import { toaster } from '../ui/toaster'

export default function JoinRoomComponent() {
  const router = useRouter()
  const { room, joinRoom } = use(RoomContext)
  const [loading, setLoading] = useState(false)

  const storedUserName = sessionStorage.getItem(room?.code || '')

  const handleJoinRoom = useCallback(
    async (code: string, userName: string) => {
      if (!userName || !code) {
        return
      }

      try {
        setLoading(true)
        await joinRoom(code, userName)
      } catch (e) {
        router.push('/')
        toaster.create({
          title: 'Erro ao entrar na sala',
          description: 'Verifique o código e tente novamente.',
          type: 'error',
        })

        setLoading(false)
        console.error('Error joining room:', e)
        return
      }
    },
    [joinRoom, router.push],
  )

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const formData = new FormData(ev.currentTarget)
    const userName = formData.get('userName') as string

    await handleJoinRoom(room?.code || '', userName)
  }

  useEffect(() => {
    if (storedUserName && room?.code) {
      handleJoinRoom(room.code || '', storedUserName)
    }
  }, [room?.code, storedUserName, handleJoinRoom])

  return (
    <Flex
      w='full'
      h='full'
      justify='center'
      align='center'
      direction={'column'}
      gap={5}
      bgImage="url('/homeBg.png')"
      bgSize='100% 100%'
      bgRepeat='no-repeat'
    >
      <Text fontSize='xl'>
        Voce está entrando na sala: <strong>{room?.name}</strong>{' '}
      </Text>
      <Flex
        w={{ base: '80vw', lg: '30vw' }}
        justify='center'
        align='center'
        bgColor='white'
        shadow={'md'}
        p={5}
        gap={5}
        direction={'column'}
        borderRadius='lg'
      >
        <chakra.form
          display='flex'
          flexDir='column'
          w='full'
          gap={5}
          onSubmit={handleSubmit}
        >
          <HStack w='full'>
            <Field.Root required>
              <Field.Label>Seu nome</Field.Label>
              <Input
                name='userName'
                placeholder='Digite o seu nome'
                defaultValue={storedUserName ?? ''}
              />
            </Field.Root>
          </HStack>
          <Button
            w='fit'
            mx='auto'
            px={7}
            colorPalette='orange'
            variant='outline'
            size='md'
            loading={loading}
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
    </Flex>
  )
}
