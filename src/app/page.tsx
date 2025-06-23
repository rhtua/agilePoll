import { Flex, Stack, Text } from '@chakra-ui/react'
import { RoomForm } from '~/components/RoomForm'

export default function Home() {
  return (
    <Flex
      p={3}
      justify='center'
      w='full'
      h='full'
      bgImage="url('/homeBg.png')"
      bgSize='100% 100%'
      bgRepeat='no-repeat'
    >
      <Stack align='center' mt={5}>
        <Text fontSize='4xl' fontWeight='bold' textAlign='start' w='full'>
          Planning Poker
        </Text>
        <Text
          fontSize='lg  '
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
