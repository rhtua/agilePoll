'use client'
import { Button, Flex, Text } from '@chakra-ui/react'
import { MdRemoveRedEye } from 'react-icons/md'
import { RiResetLeftLine } from 'react-icons/ri'
import { TbArrowsTransferDown } from 'react-icons/tb'
import { CreateMobileRobots, CreateRobots } from '~/components/Robots/RobotGrid'
import type { RobotType } from '~/mappers/usersToRobots'

interface VotingTableProps {
  firstHalf: RobotType[]
  secondHalf: RobotType[]
  revealVotes: boolean
  hasPendingVotes: boolean
  hasVotes: boolean
  isRoomOwner: boolean
  hasOtherUsers: boolean
  onPoll: () => void
  onTransferOpen: () => void
}

export default function VotingTable({
  firstHalf,
  secondHalf,
  revealVotes,
  hasPendingVotes,
  hasVotes,
  isRoomOwner,
  hasOtherUsers,
  onPoll,
  onTransferOpen,
}: VotingTableProps) {
  return (
    <Flex
      minW={'20vw'}
      minH={{ base: '20vh', '2xl': '30vh' }}
      direction='column'
      align='center'
      gap={8}
      mt={'3rem'}
    >
      <CreateRobots
        robots={firstHalf}
        isFirstRow={true}
        revealVotes={revealVotes}
        display={{ base: 'none', sm: 'flex' }}
      />

      <CreateMobileRobots
        robots={firstHalf}
        isFirstRow={true}
        revealVotes={revealVotes}
        display={{ base: 'flex', sm: 'none' }}
      />

      <Flex
        w={{ base: '90%', sm: 'full' }}
        h='15vh'
        px={5}
        py={2}
        gap={2}
        bg='var(--color-surface)'
        borderRadius='xl'
        align={'center'}
        justify={'center'}
        borderColor='var(--color-border-strong)'
        borderWidth={2}
        direction='column'
        boxShadow={
          !hasPendingVotes && !revealVotes
            ? '0 0 20px var(--color-accent-glow), inset 0 1px 3px rgba(0,0,0,0.04)'
            : 'inset 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)'
        }
        transition='box-shadow 0.5s ease'
        style={{
          background:
            'linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface-dim) 100%)',
        }}
      >
        <Text color='var(--color-text-secondary)' textAlign='center'>
          {hasPendingVotes && !revealVotes
            ? 'Aguardando votos...'
            : 'Votação concluída!'}
        </Text>
        {isRoomOwner && hasVotes && (
          <Button
            colorPalette='orange'
            variant='outline'
            size='md'
            onClick={onPoll}
            style={{
              borderColor: 'var(--color-primary)',
            }}
            fontWeight='600'
            bg={revealVotes ? 'var(--color-primary)' : 'transparent'}
            color={revealVotes ? 'white' : 'var(--color-primary)'}
          >
            {revealVotes ? <RiResetLeftLine /> : <MdRemoveRedEye />}
            {revealVotes ? 'Nova votação' : 'Revelar votos'}
          </Button>
        )}
        {isRoomOwner && hasOtherUsers && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onTransferOpen}
            color='var(--color-text-muted)'
            fontWeight='500'
            fontSize='sm'
            _hover={{
              color: 'var(--color-text-secondary)',
              bg: 'var(--color-surface-dimmer)',
            }}
          >
            <TbArrowsTransferDown />
            Transferir sala
          </Button>
        )}
      </Flex>

      <CreateRobots
        robots={secondHalf}
        isFirstRow={false}
        revealVotes={revealVotes}
        display={{ base: 'none', sm: 'flex' }}
      />

      <CreateMobileRobots
        robots={secondHalf}
        isFirstRow={false}
        revealVotes={revealVotes}
        display={{ base: 'flex', sm: 'none' }}
      />
    </Flex>
  )
}
