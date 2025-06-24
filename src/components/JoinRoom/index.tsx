import {
  Button,
  chakra,
  Field,
  Flex,
  HStack,
  Input,
  Text,
} from '@chakra-ui/react'
import type { Room, User } from '~/models/room'

interface JoinRoomProps {
  room: Room | null
  user: User | null
}

export default function LoadingJoinRom({ room, user }: JoinRoomProps) {
  if (!room) {
    return (
      <Flex w='full' h='full' justify='center' align='center' bgColor='#F1F1F1'>
        <Text fontSize='xl'>Carregando...</Text>
      </Flex>
    )
  }

  if (!room.users.some((u) => u.uid === user?.uid)) {
    // If the user is not in the room, show a field to type the name
    return (
      <Flex w='full' h='full' justify='center' align='center'>
        <Flex
          w={{ base: '80vw', lg: '40vw' }}
          justify='center'
          align='center'
          bgColor='white'
          shadow={'md'}
          p={5}
          gap={5}
          direction={'column'}
          borderRadius='md'
        >
          <Text fontSize='xl'>Voce está entrando na sala {room.name}</Text>
          <chakra.form
            display='flex'
            flexDir='column'
            w='50%'
            gap={3}
            // onSubmit={handleJoinRoom}
          >
            <HStack w='full'>
              <Field.Root required>
                <Field.Label>Seu nome</Field.Label>
                <Input name='userName' placeholder='Digite o seu nome' />
              </Field.Root>
            </HStack>
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
      </Flex>
    )
  }

  return undefined
}
