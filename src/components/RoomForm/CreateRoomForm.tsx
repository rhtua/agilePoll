'use client'
import {
  Button,
  chakra,
  Field,
  Flex,
  HStack,
  Input,
  InputGroup,
  Portal,
  Select,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { type FormEvent, use, useState } from 'react'
import {
  createSelectPointOptions,
  SuggestedPoints,
} from '~/constants/defaultPoints'
import { RoomContext } from '~/contexts/room'
import { InfoTip } from '../ui/toggle-tip'

export function CreateRoomForm() {
  const { createRoom } = use(RoomContext)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      const roomCode = await createRoom(name, userName, points)
      router.push(`/room/${roomCode}`)
    } catch (e) {
      console.error('Error creating room:', e)
      setLoading(false)
    }
  }

  return (
    <Flex w='full' direction='column' align='center' gap={3}>
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
          style={{ backgroundColor: 'var(--color-primary)' }}
          color='white'
          fontWeight='600'
          fontSize='md'
          px={10}
          size='md'
          loading={loading}
          type='submit'
        >
          Criar sala
        </Button>
      </chakra.form>
    </Flex>
  )
}
