'use client'
import { Button, Flex, Spinner, Text } from '@chakra-ui/react'
import { use, useMemo } from 'react'
import { MdRemoveRedEye } from 'react-icons/md'
import { RiResetLeftLine } from 'react-icons/ri'
import Cards from '~/components/Cards'
import JoinRoomComponent from '~/components/JoinRoom'
import PollResults from '~/components/PollResults'
import { RoomContext } from '~/contexts/room'
import mapUsersToRobots from '~/mappers/usersToRobots'
import { CreateMobileRobots, CreateRobots } from './createRobots'

const DEFAULT_POINTS = ['0.5', '1', '1.5', '2', '2.5', '3']

export default function RoomPage() {
  const { room, resetVotes, isLoading, user, toggleRevealVotes } =
    use(RoomContext)
  const users = Object.values(room?.users || {})

  const { firstHalf, secondHalf } = mapUsersToRobots(users)

  const hasPendingVotes = useMemo(
    () => users.some((user) => !user.vote),
    [users],
  )

  const hasVotes = useMemo(() => users.some((user) => user.vote), [users])

  const isRoomOwner = useMemo(
    () => room?.ownerUid === user?.uid,
    [room?.ownerUid, user?.uid],
  )

  const points = useMemo(() => {
    if (!room?.points) return DEFAULT_POINTS

    return room.points.split(',').map((point) => point.trim())
  }, [room])

  function handlePoll() {
    if (room?.revealVotes) {
      resetVotes()
    }
    toggleRevealVotes(!room?.revealVotes)
  }

  if (isLoading) {
    return (
      <Flex w='full' h='full' justify='center' align='center' bg='gray.100'>
        <Flex direction='column' align='center' gap={4}>
          <Spinner size='xl' color='orange.500' />
          <Text fontSize='xl'>Carregando...</Text>
        </Flex>
      </Flex>
    )
  }

  if (room && !users?.some((roomuser) => roomuser.uid === user?.uid)) {
    return <JoinRoomComponent />
  }

  if (!room) {
    return (
      <Flex w='full' h='full' justify='center' align='center' bg='gray.100'>
        <Text fontSize='xl'>Sala não encontrada</Text>
      </Flex>
    )
  }

  return (
    <Flex
      w='full'
      h='full'
      justify='space-between'
      align='center'
      bg='gray.100'
      direction='column'
    >
      {/* Table */}
      <Flex
        minW={'20vw'}
        minH={{ base: '20vh', '2xl': '30vh' }}
        direction='column'
        align='center'
        gap={8}
        mt={'3rem'}
      >
        <CreateRobots
          robots={firstHalf}
          isFirstRow={true}
          revealVotes={room?.revealVotes}
          display={{ base: 'none', sm: 'flex' }}
        />

        <CreateMobileRobots
          robots={firstHalf}
          isFirstRow={true}
          revealVotes={room?.revealVotes}
          display={{ base: 'flex', sm: 'none' }}
        />

        <Flex
          w={{ base: '90%', sm: 'full' }}
          h='15vh'
          px={5}
          py={2}
          gap={2}
          bg='gray.50'
          borderRadius='lg'
          align={'center'}
          justify={'center'}
          borderColor='gray.400'
          borderWidth={4}
          direction='column'
        >
          <Text>
            {hasPendingVotes && !room?.revealVotes
              ? 'Aguardando votos...'
              : 'Votação concluída!'}
          </Text>
          {isRoomOwner && hasVotes && (
            <Button
              colorPalette='orange'
              variant='outline'
              size='md'
              onClick={handlePoll}
              borderColor='orange.500'
              fontWeight='600'
              bg={room?.revealVotes ? 'orange.500' : 'transparent'}
              color={room?.revealVotes ? 'white' : 'orange.500'}
            >
              {room?.revealVotes ? <RiResetLeftLine /> : <MdRemoveRedEye />}
              {room?.revealVotes ? 'Nova votação' : 'Revelar votos'}
            </Button>
          )}
        </Flex>

        <CreateRobots
          robots={secondHalf}
          isFirstRow={false}
          revealVotes={room?.revealVotes}
          display={{ base: 'none', sm: 'flex' }}
        />

        <CreateMobileRobots
          robots={secondHalf}
          isFirstRow={false}
          revealVotes={room?.revealVotes}
          display={{ base: 'flex', sm: 'none' }}
        />
      </Flex>

      {room?.revealVotes ? (
        <PollResults users={users} />
      ) : (
        <Flex
          w={'100vw'}
          justifyContent={{ base: 'start', lg: 'center' }}
          justify='center'
          overflowX={'auto'}
          overflowY={'hidden'}
        >
          <Cards canVote={!room?.revealVotes} cards={points} />
        </Flex>
      )}
    </Flex>
  )
}
