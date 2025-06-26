'use client'
import {
  Button,
  Flex,
  Group,
  HStack,
  Input,
  Menu,
  Popover,
  Portal,
  Spacer,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { use } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { LiaUserAstronautSolid } from 'react-icons/lia'
import { MdCopyAll, MdKeyboardArrowDown } from 'react-icons/md'
import { TbLogout } from 'react-icons/tb'
import { RoomContext } from '~/contexts/room'
import { toaster } from '../ui/toaster'

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { room } = useParams()
  const { user, room: roomData, leaveRoom } = use(RoomContext)
  const router = useRouter()

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
          src='/agilePoll.png'
          alt='Logo'
          width={120}
          height={100}
          onClick={() => {
            router.push('/')
          }}
          style={{ objectFit: 'contain', cursor: 'pointer' }}
        />
        <Spacer />
        {room && (
          <HStack>
            <Popover.Root>
              <Popover.Trigger asChild>
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
              </Popover.Trigger>
              <Portal>
                <Popover.Positioner>
                  <Popover.Content>
                    <Popover.Arrow />
                    <Popover.Body>
                      <Popover.Title fontWeight='medium' textAlign={'center'}>
                        Convide através do link
                      </Popover.Title>
                      <Group gap={0} align='end' w='full'>
                        <Input
                          _focus={{ border: 'none', outline: 'none' }}
                          bgColor={'#F0F0F0'}
                          value={
                            typeof window !== 'undefined'
                              ? window.location.href
                              : ''
                          }
                          readOnly
                          mt={2}
                          borderRightRadius={0}
                        />
                        <Button
                          bgColor={'#DD6B20'}
                          borderLeftRadius={0}
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              navigator.clipboard.writeText(
                                window.location.href,
                              )
                              toaster.create({
                                title: 'Link copiado com sucesso!',
                                description:
                                  'Você pode compartilhar o link com seus amigos.',
                                duration: 3000,
                                type: 'success',
                              })
                            }
                          }}
                        >
                          <MdCopyAll />
                        </Button>
                      </Group>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>

            <Menu.Root>
              <Menu.Trigger asChild>
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
                  {roomData?.users?.find((u) => u.uid === user?.uid)?.name ||
                    'Usuário'}
                  <MdKeyboardArrowDown />
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      value='logout'
                      onSelect={async () => {
                        router.push('/')
                        leaveRoom()
                      }}
                      justifyContent='center'
                    >
                      Sair <TbLogout />
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        )}
      </Flex>
      {children}
    </Flex>
  )
}
