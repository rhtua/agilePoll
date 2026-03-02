'use client'
import { Avatar, HStack, Menu, Portal, Spinner, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { TbLogout } from 'react-icons/tb'
import { ROBOT_AVATAR_URL } from '~/mappers/usersToRobots'

interface UserMenuProps {
  userName: string | undefined
  userUid: string | undefined
  onLeave: () => void
}

export default function UserMenu({
  userName,
  userUid,
  onLeave,
}: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <Menu.Root open={isMenuOpen}>
      <Menu.Trigger asChild>
        <HStack
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          cursor={'pointer'}
          gap={2}
          px={2}
          py={1}
          borderRadius='lg'
          transition='all 0.2s ease'
          _hover={{
            bg: 'var(--color-surface-dimmer)',
          }}
        >
          <Avatar.Root shape='rounded' size='sm'>
            <Avatar.Fallback>
              <Spinner size='sm' />
            </Avatar.Fallback>
            <Avatar.Image
              src={userUid ? `${ROBOT_AVATAR_URL}${userUid}` : undefined}
            />
          </Avatar.Root>
          <Text
            fontWeight={600}
            fontSize='sm'
            color='var(--color-text)'
            display={{ base: 'none', md: 'block' }}
          >
            {userName || ''}
          </Text>
          <MdKeyboardArrowDown style={{ color: 'var(--color-text-muted)' }} />
        </HStack>
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
                  onLeave()
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
  )
}
