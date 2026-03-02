'use client'
import { Flex, HStack, Image, Spacer, Text } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { use } from 'react'
import { RoomContext } from '~/contexts/room'
import InvitePopover from './InvitePopover'
import UserMenu from './UserMenu'

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { room } = useParams()
  const { user, room: roomData, leaveRoom } = use(RoomContext)
  const userName = roomData?.users?.find((u) => u.uid === user?.uid)?.name
  const router = useRouter()

  return (
    <Flex
      w={'100vw'}
      overflow={'hidden'}
      h={'100%'}
      align={'start'}
      justify={'start'}
      direction={'column'}
    >
      <Flex
        w='full'
        h={'9vh'}
        px={{ base: 4, md: 4, lg: 8, xl: 10 }}
        py={2}
        shadow={room ? 'lg' : 'none'}
        align='center'
      >
        <HStack
          gap={2}
          onClick={() => router.push('/')}
          cursor='pointer'
          _hover={{ opacity: 0.85 }}
          transition='opacity 0.2s ease'
        >
          <Image
            src='/agilePollV2.svg'
            alt='AgilePoll'
            height={{ base: '32px', md: '40px' }}
            width='auto'
            style={{ objectFit: 'contain' }}
          />
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight='700'
            color='var(--color-text)'
            letterSpacing='-0.02em'
          >
            Agile
            <Text
              as='span'
              fontWeight='700'
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Poll
            </Text>
          </Text>
        </HStack>
        <Spacer />
        {room && (
          <HStack gap={3}>
            <InvitePopover />
            <UserMenu
              userName={userName}
              userUid={user?.uid}
              onLeave={leaveRoom}
            />
          </HStack>
        )}
      </Flex>
      {children}
    </Flex>
  )
}
