'use client'
import { Button, Group, Input, Popover, Portal } from '@chakra-ui/react'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { MdCopyAll } from 'react-icons/md'
import { toaster } from '../ui/toaster'

export default function InvitePopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          colorPalette='orange'
          variant='outline'
          size={{ base: 'sm', md: 'md' }}
          style={{
            borderColor: 'var(--color-primary)',
            fontWeight: 600,
            color: 'var(--color-primary)',
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
                    typeof window !== 'undefined' ? window.location.href : ''
                  }
                  readOnly
                  mt={2}
                  borderRightRadius={0}
                />
                <Button
                  bgColor={'var(--color-primary)'}
                  borderLeftRadius={0}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href)
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
  )
}
