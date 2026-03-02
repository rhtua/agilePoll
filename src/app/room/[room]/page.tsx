'use client'
import { Flex, Spinner, Text } from '@chakra-ui/react'
import { use, useMemo, useState } from 'react'
import Cards from '~/components/Cards'
import JoinRoomComponent from '~/components/JoinRoom'
import PollResults from '~/components/PollResults'
import TransferDialog from '~/components/TransferDialog'
import VotingTable from '~/components/VotingTable'
import { RoomContext } from '~/contexts/room'
import mapUsersToRobots from '~/mappers/usersToRobots'

const DEFAULT_POINTS = ['0.5', '1', '1.5', '2', '2.5', '3']

export default function RoomPage() {
  const {
    room,
    resetVotes,
    isLoading,
    user,
    toggleRevealVotes,
    transferOwnership,
  } = use(RoomContext)
  const allUsers = Object.values(room?.users || {})
  const users = allUsers.filter(
    (u) => u.online !== false || u.uid === user?.uid,
  )
  const [isTransferOpen, setIsTransferOpen] = useState(false)

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

  const otherUsers = useMemo(
    () => users.filter((u) => u.uid !== user?.uid),
    [users, user?.uid],
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
      <Flex
        w='full'
        h='full'
        justify='center'
        align='center'
        className='room-bg'
      >
        <Flex direction='column' align='center' gap={4}>
          <Spinner size='xl' color='orange.500' />
          <Text fontSize='xl' color='var(--color-text)'>
            Carregando...
          </Text>
        </Flex>
      </Flex>
    )
  }

  if (room && !allUsers?.some((roomuser) => roomuser.uid === user?.uid)) {
    return <JoinRoomComponent />
  }

  if (!room) {
    return (
      <Flex
        w='full'
        h='full'
        justify='center'
        align='center'
        className='room-bg'
      >
        <Text fontSize='xl' color='var(--color-text)'>
          Sala não encontrada
        </Text>
      </Flex>
    )
  }

  return (
    <Flex
      w='full'
      h='full'
      justify='space-between'
      align='center'
      className='room-bg'
      direction='column'
    >
      <VotingTable
        firstHalf={firstHalf}
        secondHalf={secondHalf}
        revealVotes={room.revealVotes}
        hasPendingVotes={hasPendingVotes}
        hasVotes={hasVotes}
        isRoomOwner={isRoomOwner}
        hasOtherUsers={otherUsers.length > 0}
        onPoll={handlePoll}
        onTransferOpen={() => setIsTransferOpen(true)}
      />

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

      <TransferDialog
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        otherUsers={otherUsers}
        onTransfer={transferOwnership}
      />
    </Flex>
  )
}
