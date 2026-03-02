'use client'
import {
  Avatar,
  Button,
  Dialog,
  Portal,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ROBOT_AVATAR_URL } from '~/mappers/usersToRobots'
import type { User } from '~/models/room'
import { toaster } from '../ui/toaster'

interface TransferDialogProps {
  isOpen: boolean
  onClose: () => void
  otherUsers: User[]
  onTransfer: (newOwnerUid: string) => Promise<void>
}

export default function TransferDialog({
  isOpen,
  onClose,
  otherUsers,
  onTransfer,
}: TransferDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleTransfer(newOwnerUid: string) {
    try {
      setLoading(true)
      await onTransfer(newOwnerUid)
      toaster.create({
        title: 'Ownership transferido!',
        description: 'O novo dono da sala já pode gerenciar as votações.',
        duration: 3000,
        type: 'success',
      })
      onClose()
    } catch (e) {
      console.error('Error transferring ownership:', e)
      toaster.create({
        title: 'Erro ao transferir',
        description: 'Tente novamente.',
        duration: 3000,
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement='center'
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius='xl'>
            <Dialog.Header>
              <Dialog.Title fontWeight='700'>Transferir sala</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              justifyContent='center'
              alignItems='center'
              alignContent='center'
              display='flex'
              flexDirection='column'
            >
              <Text mb={4} color='var(--color-text-secondary)'>
                Escolha o novo dono da sala. Você perderá os controles de
                votação.
              </Text>
              <Stack gap={2} w='fit-content'>
                {otherUsers.map((u) => (
                  <Button
                    key={u.uid}
                    variant='outline'
                    justifyContent='start'
                    w='auto'
                    py={5}
                    px={4}
                    borderRadius='lg'
                    borderColor='transparent'
                    fontWeight='500'
                    color='var(--color-text)'
                    _hover={{
                      borderColor: 'transparent',
                      bg: 'var(--color-primary-light)',
                    }}
                    loading={loading}
                    onClick={() => handleTransfer(u.uid)}
                  >
                    <Avatar.Root shape='rounded' size='sm'>
                      <Avatar.Fallback>
                        <Spinner size='sm' />
                      </Avatar.Fallback>
                      <Avatar.Image src={`${ROBOT_AVATAR_URL}${u.uid}`} />
                    </Avatar.Root>

                    {u.name}
                  </Button>
                ))}
              </Stack>
            </Dialog.Body>
            <Dialog.CloseTrigger position='absolute' top={3} right={3} />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
