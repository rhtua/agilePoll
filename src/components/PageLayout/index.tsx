'use client'
import { Button, Flex, HStack, Spacer } from '@chakra-ui/react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { LiaUserAstronautSolid } from 'react-icons/lia'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useFirebase } from '~/hooks/useFirebase'

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { room } = useParams()
  const { user, room: roomData } = useFirebase()

  return (
    <Flex
      w={'100vw'}
      overflow={'hidden'}
      h={'100vh'}
      align={'start'}
      justify={'start'}
      direction={'column'}
    >
      <Flex w='full' h={'9vh'} px={10} py={2} shadow={room ? 'lg' : 'none'}>
        <Image
          src='/icon.svg'
          alt='Logo'
          width={120}
          height={100}
          style={{ objectFit: 'contain' }}
        />
        <Spacer />
        {room && (
          <HStack>
            <Button
              colorPalette='orange'
              variant='outline'
              size='md'
              style={{
                borderColor: '#DD6B20',
                fontWeight: 600,
                color: '#DD6B20',
              }}
            >
              <AiOutlineUserAdd />
              Convidar
            </Button>
            <Button
              colorPalette='orange'
              size='md'
              style={{
                backgroundColor: '#DD6B20',
                fontWeight: 600,
                color: 'white',
              }}
            >
              <LiaUserAstronautSolid />{' '}
              {roomData?.users.find((u) => u.uid === user?.uid)?.name ||
                'Usuário'}
              <MdKeyboardArrowDown />
            </Button>
          </HStack>
        )}
      </Flex>
      {children}
    </Flex>
  )
}
