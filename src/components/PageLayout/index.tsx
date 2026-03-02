'use client'
import { Button, Flex, HStack, Image, Spacer, Text } from '@chakra-ui/react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { TbArrowsTransferDown } from 'react-icons/tb'
import TransferDialog from '~/components/TransferDialog'
import { RoomContext } from '~/contexts/room'
import InvitePopover from './InvitePopover'
import UserMenu from './UserMenu'

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { room } = useParams()
  const {
    user,
    room: roomData,
    leaveRoom,
    transferOwnership,
  } = use(RoomContext)
  const userName = roomData?.users?.find((u) => u.uid === user?.uid)?.name
  const router = useRouter()
  const pathname = usePathname()

  const [isTransferOpen, setIsTransferOpen] = useState(false)

  const isRoomOwner = roomData?.ownerUid === user?.uid
  const allUsers = Object.values(roomData?.users || {})
  const activeUsers = allUsers.filter(
    (u) => u.online !== false || u.uid === user?.uid,
  )
  const otherUsers = activeUsers.filter((u) => u.uid !== user?.uid)
  const hasOtherUsers = otherUsers.length > 0

  return (
    <Flex
      w={'100vw'}
      overflow={'auto'}
      minH={'100%'}
      align={'start'}
      justify={'start'}
      direction={'column'}
      userSelect='none'
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

        {roomData?.name && pathname.includes('/room') && (
          <HStack gap={3} ml={4} display={{ base: 'none', sm: 'flex' }}>
            <Text
              color='var(--color-border-strong)'
              fontSize='xl'
              fontWeight='300'
            >
              /
            </Text>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight='600'
              color='var(--color-text-secondary)'
              lineClamp={1}
              maxW={{ base: '150px', md: '300px' }}
            >
              {roomData.name}
            </Text>
          </HStack>
        )}
        <Spacer />
        {room && (
          <HStack gap={3}>
            {isRoomOwner && hasOtherUsers && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsTransferOpen(true)}
                color='var(--color-text-muted)'
                fontWeight='500'
                fontSize='sm'
                _hover={{
                  color: 'var(--color-text-secondary)',
                  bg: 'var(--color-surface-dimmer)',
                }}
              >
                <TbArrowsTransferDown />
                <Text display={{ base: 'none', md: 'block' }}>
                  Transferir sala
                </Text>
              </Button>
            )}
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
      {isRoomOwner && hasOtherUsers && (
        <TransferDialog
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          otherUsers={otherUsers}
          onTransfer={transferOwnership}
        />
      )}
    </Flex>
  )
}
