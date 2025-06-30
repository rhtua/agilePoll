'use client'
import {
  Avatar,
  Button,
  Flex,
  Group,
  HStack,
  Image,
  Input,
  Menu,
  Popover,
  Portal,
  Spacer,
  Spinner,
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { LiaUserAstronautSolid } from 'react-icons/lia'
import { MdCopyAll, MdKeyboardArrowDown } from 'react-icons/md'
import { TbLogout } from 'react-icons/tb'
import { RoomContext } from '~/contexts/room'
import { ROBOT_AVATAR_URL } from '~/mappers/usersToRobots'
import { toaster } from '../ui/toaster'

export default function PageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { room } = useParams()
  const { user, room: roomData, leaveRoom } = use(RoomContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
      >
        <Image
          src='/agilePoll.png'
          alt='Logo'
          width={{ base: 24, md: 36 }}
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
                  size={{ base: 'sm', md: 'md' }}
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

            <Menu.Root open={isMenuOpen}>
              <Menu.Trigger asChild>
                <Flex
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  cursor={'pointer'}
                >
                  <Avatar.Root
                    shape='rounded'
                    size='sm'
                    display={{ base: 'flex', md: 'none' }}
                  >
                    <Avatar.Fallback>
                      <Spinner />
                    </Avatar.Fallback>
                    <Avatar.Image
                      src={user ? `${ROBOT_AVATAR_URL}${user.uid}` : undefined}
                    />
                  </Avatar.Root>
                  <Button
                    colorPalette='orange'
                    display={{ base: 'none', md: 'flex' }}
                    size='md'
                    loading={
                      roomData?.users?.find((u) => u.uid === user?.uid)
                        ?.name === undefined
                    }
                    style={{
                      backgroundColor: '#DD6B20',
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    <LiaUserAstronautSolid /> {userName || ''}
                    <MdKeyboardArrowDown />
                  </Button>
                </Flex>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.ItemGroup>
                      <Menu.ItemGroupLabel textAlign='center' mb={1}>
                        {userName || ''}
                      </Menu.ItemGroupLabel>
                      <Menu.Item
                        value='logout'
                        onSelect={async () => {
                          leaveRoom()
                          setIsMenuOpen(false)
                        }}
                        justifyContent='center'
                      >
                        Sair <TbLogout />
                      </Menu.Item>
                    </Menu.ItemGroup>
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
