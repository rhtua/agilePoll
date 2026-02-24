import { Flex, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { RoomForm } from '~/components/RoomForm'

export default function Home() {
  return (
    <Flex
      p={3}
      justify='center'
      w='full'
      h='full'
      position='relative'
      overflow='hidden'
    >
      <Image
        src='/homeBg.png'
        alt='Background Image'
        fill
        sizes='100vw'
        priority
        style={{
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      <Stack align='center' mt={5} zIndex={1}>
        <Text fontSize='4xl' fontWeight='bold' textAlign='start' w='full'>
          Planning Poker
        </Text>
        <Text
          fontSize='lg'
          fontWeight='400'
          textAlign='start'
          w='full'
          mb={3}
        >
          Crie ou entre em uma sala, convide participantes e comece a votar
        </Text>
        <RoomForm />
      </Stack>
    </Flex>
  )
}
