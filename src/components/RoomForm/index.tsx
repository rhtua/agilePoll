'use client'
import { Flex, HStack, Separator, Text } from '@chakra-ui/react'
import { CreateRoomForm } from './CreateRoomForm'
import { JoinRoomForm } from './JoinRoomForm'

export { CreateRoomForm } from './CreateRoomForm'
export { JoinRoomForm } from './JoinRoomForm'

export function RoomForm() {
  return (
    <Flex
      w={{ base: '80vw', md: '50vw' }}
      direction='column'
      maxH='70vh'
      align='center'
      bgColor='white'
      overflowY='auto'
      gap={3}
      borderRadius='xl'
      shadow='xl'
      px={5}
      py={8}
      borderWidth={1}
      borderColor='var(--color-border)'
    >
      <CreateRoomForm />
      <HStack w={'40%'}>
        <Separator colorPalette='orange' flex='1' />
        <Text flexShrink='0'>ou</Text>
        <Separator flex='1' />
      </HStack>
      <JoinRoomForm />
    </Flex>
  )
}
