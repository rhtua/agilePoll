'use client'
import { Flex, HStack } from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import Cards from '~/components/Cards'
import Robot from '~/components/Robots'
import { useFirebase } from '~/hooks/useFirebase'

export default function RoomPage() {
  const { room } = useParams()
  const { room: dbRoom } = useFirebase()

  console.log('Room:', dbRoom)

  const robots =
    room
      ?.toString()
      .split('')
      .map((char) => {
        return `https://api.dicebear.com/9.x/bottts-neutral/png?seed=${char}`
      }) ?? []

  const halfLength = Math.ceil(robots.length / 2)

  const firstHalf = robots.slice(0, halfLength)
  const secondHalf = robots.slice(halfLength)

  const justifyRobots = (list: string[]) => {
    if (list.length % 2 === 0 && list.length > 2) {
      return 'space-between'
    }
    return 'space-evenly'
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
            <Robot key={robot} avatar={robot} name={robot} />
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
        >
          Agurdardando votos...
        </Flex>
        <HStack w={'full'} justify={justifyRobots(secondHalf)} gap={10}>
          {secondHalf?.map((robot) => (
            <Robot key={robot} avatar={robot} name={robot} />
          ))}
        </HStack>
      </Flex>
      <Cards cards={['0.5', '1', '1.5', '2', '2.5', '3']} />
    </Flex>
  )
}
