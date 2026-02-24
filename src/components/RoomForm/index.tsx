'use client'
import {
  Button,
  chakra,
  createListCollection,
  Field,
  Flex,
  HStack,
  Input,
  InputGroup,
  Portal,
  Select,
  Separator,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { type FormEvent, use, useState } from 'react'
import { withMask } from 'use-mask-input'
import {
  createSelectPointOptions,
  SuggestedPoints,
} from '~/constants/defaultPoints'
import { RoomContext } from '~/contexts/room'
import { toaster } from '../ui/toaster'
import { InfoTip } from '../ui/toggle-tip'

export function RoomForm() {
  const { createRoom, joinRoom } = use(RoomContext)
  const router = useRouter()
  const [loading, setLoading] = useState<'join' | 'create' | undefined>(
    undefined,
  )

  const DEFAULT_POINTS = SuggestedPoints[0].points.join(' ,')

  const [points, setPoints] = useState<string>(DEFAULT_POINTS)
  const pointOptions = createSelectPointOptions()

  async function handleCreateRoom(ev: FormEvent<HTMLFormElement>) {
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

  async function handleJoinRoom(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const formData = new FormData(ev.currentTarget)
    const code = formData.get('code') as string

    if (!code) {
      return
    }

    setLoading('join')
    router.push(`/room/${code}`)
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
        <HStack w='full'>
          <Field.Root required>
            <Field.Label>Nome da sala</Field.Label>
            <Input name='roomName' placeholder='Escolha o nome da sala' />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Seu nome</Field.Label>
            <Input name='userName' placeholder='Digite o seu nome' />
          </Field.Root>
        </HStack>

        <Field.Root required>
          <Field.Label>Pontuação</Field.Label>
          <Select.Root
            size={'md'}
            defaultValue={[DEFAULT_POINTS]}
            onValueChange={(e) => setPoints(e.value[0])}
            collection={pointOptions}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder='Customizado' />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {SuggestedPoints.map((i) => (
                    <Select.Item item={i.points.join(' ,')} key={i.name}>
                      {`${i.name} ${i.points.length > 0 ? `(${i.points.join(' ,')})` : ''}`}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <InputGroup
            endElement={
              <InfoTip
                content="A média sera calculada apenas se os pontos forem numéricos, exceto
            '?' e '☕︎'.'"
              />
            }
          >
            <Input
              name='points'
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder='0,1,1.5,2,2.5,3,4,5'
            />
          </InputGroup>
        </Field.Root>

        <Button
          w='fit'
          mx='auto'
          colorPalette='orange'
          bg='orange.500'
          color='white'
          fontWeight='600'
          fontSize='md'
          px={10}
          size='md'
          loading={loading === 'create'}
          disabled={loading === 'join'}
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
          <Field.Root required w='full'>
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
          borderColor='orange.500'
          color='orange.500'
          fontWeight='600'
          fontSize='md'
          size='md'
          loading={loading === 'join'}
          disabled={loading === 'create'}
          type='submit'
        >
          Entrar na sala
        </Button>
      </chakra.form>
    </Flex>
  )
}
