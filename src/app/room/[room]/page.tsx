'use client'
import { Button, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { FaCheckCircle, FaClock } from 'react-icons/fa'
import { MdRemoveRedEye } from 'react-icons/md'
import { RiResetLeftLine } from 'react-icons/ri'
import Cards from '~/components/Cards'
import Robot from '~/components/Robots'
import { useFirebase } from '~/hooks/useFirebase'

export default function RoomPage() {
  const { room, resetVotes } = useFirebase()
  const [revealVotes, setRevealVotes] = useState(false)

  const robots =
    room?.users.map((user) => {
      return {
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${user.uid}`,
        name: user.name,
        vote: user.vote,
      }
    }) ?? []

  const halfLength = Math.ceil(robots.length / 2)

  const firstHalf = robots.slice(0, halfLength)
  const secondHalf = robots.slice(halfLength)

  const justifyRobots = (list: any[]) => {
    if (list.length % 2 === 0 && list.length > 2) {
      return 'space-between'
    }
    return 'space-evenly'
  }

  function handleVotes() {
    if (revealVotes) {
      resetVotes()
    }

    setRevealVotes((prev) => !prev)
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
        <HStack w={'full'} justify={justifyRobots(firstHalf)} gap={10}>
          {firstHalf?.map((robot) => (
            <Stack key={robot.avatar} align={'center'} gap={2}>
              {robot.vote && robot.vote !== '' && (
                <FaCheckCircle color='green' />
              )}
              {robot.vote === '' && <FaClock color='gray' />}
              <Robot
                avatar={robot.avatar}
                name={robot.name}
                vote={robot.vote}
                revealVotes={revealVotes}
              />
            </Stack>
          ))}
        </HStack>
        <Flex
          w='full'
          h='15vh'
          bgColor={'#FBFBFB'}
          borderRadius='lg'
          align={'center'}
          justify={'center'}
          borderColor={'#C0C0C0'}
          borderWidth={4}
          direction='column'
        >
          {room?.users.some((user) => !user.vote) && (
            <Text>Agurdardando votos...</Text>
          )}
          <Button
            colorPalette='orange'
            variant='outline'
            size='md'
            onClick={handleVotes}
            style={{
              borderColor: '#DD6B20',
              fontWeight: 600,
              backgroundColor: revealVotes ? '#DD6B20' : 'transparent',
              color: revealVotes ? 'white' : '#DD6B20',
            }}
          >
            {revealVotes && <RiResetLeftLine />}
            {!revealVotes && <MdRemoveRedEye />}
            {revealVotes ? 'Nova votação' : 'Revelar votos'}
          </Button>
        </Flex>
        <HStack w={'full'} justify={justifyRobots(secondHalf)} gap={10}>
          {secondHalf?.map((robot) => (
            <Robot
              key={robot.avatar}
              avatar={robot.avatar}
              name={robot.name}
              revealVotes={revealVotes}
            />
          ))}
        </HStack>
      </Flex>
      <Cards
        canVote={!revealVotes}
        cards={['0.5', '1', '1.5', '2', '2.5', '3']}
      />
    </Flex>
  )
}
