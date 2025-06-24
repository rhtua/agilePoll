'use client'
import {
  Button,
  chakra,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { use, useCallback, useEffect, useMemo, useState } from 'react'
import { FaCheckCircle, FaClock } from 'react-icons/fa'
import { MdRemoveRedEye } from 'react-icons/md'
import { RiResetLeftLine } from 'react-icons/ri'
import Cards from '~/components/Cards'
import JoinRoomComponent from '~/components/JoinRoom'
import Robot from '~/components/Robots'
import { toaster } from '~/components/ui/toaster'
import { RoomContext } from '~/contexts/room'
import mapUsersToRobots, { type RobotType } from '~/mappers/usersToRobots'

export default function RoomPage() {
  const { room, resetVotes, isLoading, user } = use(RoomContext)
  const router = useRouter()
  const [revealVotes, setRevealVotes] = useState(false)

  const { firstHalf, secondHalf } = mapUsersToRobots(room?.users || [])

  useEffect(() => {
    if (!room && !isLoading) {
      router.push('/')
      toaster.create({
        title: 'Sala não encontrada',
        description:
          'A sala que você está tentando acessar não existe ou foi removida.',
        type: 'error',
      })
    }
  }, [room, isLoading, router])

  const hasPendingVotes = useMemo(
    () => room?.users?.some((user) => !user.vote),
    [room?.users],
  )

  const isRoomOwner = useMemo(
    () => room?.ownerUid === user?.uid,
    [room?.ownerUid, user?.uid],
  )

  const buttonStyles = useMemo(
    () => ({
      borderColor: '#DD6B20',
      fontWeight: 600,
      backgroundColor: revealVotes ? '#DD6B20' : 'transparent',
      color: revealVotes ? 'white' : '#DD6B20',
    }),
    [revealVotes],
  )

  const createRobots = useCallback(
    (robots: RobotType[], isFirstRow: boolean) => {
      if (!robots || robots.length === 0) return null

      return (
        <HStack
          w={'full'}
          justify={
            robots.length % 2 === 0 && robots.length > 2
              ? 'space-between'
              : 'space-evenly'
          }
          gap={10}
        >
          {robots.map((robot) => (
            <Stack
              key={robot.avatar}
              align={'center'}
              gap={isFirstRow ? 2 : 5}
              direction={isFirstRow ? 'column' : 'column-reverse'}
            >
              {robot.vote ? (
                <FaCheckCircle color='green' />
              ) : (
                <FaClock color='gray' />
              )}
              <Robot
                avatar={robot.avatar}
                name={robot.name}
                vote={robot.vote}
                revealVotes={revealVotes}
              />
            </Stack>
          ))}
        </HStack>
      )
    },
    [revealVotes],
  )

  function handleVotes() {
    if (revealVotes) {
      resetVotes()
    }

    setRevealVotes((prev) => !prev)
  }

  if (isLoading) {
    return (
      <Flex w='full' h='full' justify='center' align='center' bgColor='#F1F1F1'>
        <Flex direction='column' align='center' gap={4}>
          <Spinner size='xl' color='orange.500' />
          <Text fontSize='xl'>Carregando...</Text>
        </Flex>
      </Flex>
    )
  }

  if (!room?.users?.some((roomuser) => roomuser.uid === user?.uid)) {
    return <JoinRoomComponent />
  }

  return (
    <Flex
      w='full'
      h='full'
      justify='space-between'
      align='center'
      bgColor='#F1F1F1'
      direction='column'
    >
      {/* Table */}
      <Flex
        minW={'20vw'}
        minH={{ base: '20vh', '2xl': '30vh' }}
        direction='column'
        gap={8}
        mt={{ base: 10, xl: 16, '2xl': 20 }}
      >
        {createRobots(firstHalf, true)}

        <Flex
          w='full'
          h='15vh'
          px={5}
          py={2}
          gap={2}
          bgColor={'#FBFBFB'}
          borderRadius='lg'
          align={'center'}
          justify={'center'}
          borderColor={'#C0C0C0'}
          borderWidth={4}
          direction='column'
        >
          <Text>
            {hasPendingVotes ? 'Aguardando votos...' : 'Votação concluída!'}
          </Text>
          {isRoomOwner && (
            <Button
              colorPalette='orange'
              variant='outline'
              size='md'
              onClick={handleVotes}
              style={buttonStyles}
            >
              {revealVotes ? <RiResetLeftLine /> : <MdRemoveRedEye />}
              {revealVotes ? 'Nova votação' : 'Revelar votos'}
            </Button>
          )}
        </Flex>

        {createRobots(secondHalf, false)}
      </Flex>
      <Cards
        canVote={!revealVotes}
        cards={['0.5', '1', '1.5', '2', '2.5', '3']}
      />
    </Flex>
  )
}
