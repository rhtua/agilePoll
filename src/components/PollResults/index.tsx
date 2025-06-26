'use client'
import { Flex, Stack, Text } from '@chakra-ui/react'
import type { User } from '~/models/room'
import { CardsIcon } from '../Cards'

interface CardsProps {
  users: User[]
}

export default function PollResults({ users }: CardsProps) {
  const votes = users.map((user) => user.vote).filter((v) => Boolean(v))

  const validVotes = votes.filter((vote) => !Number.isNaN(parseFloat(vote!)))

  const totalVotes = validVotes.length
  const avg =
    validVotes.reduce((acc, vote) => acc + parseFloat(vote ?? '0'), 0) /
    totalVotes

  const ranking = votes.reduce<Record<string, number>>(
    (acc, value) => ({
      // biome-ignore lint/performance/noAccumulatingSpread: <not relevant>
      ...acc,
      [value as string]: (acc[value as string] || 0) + 1,
    }),
    {},
  )

  const card = Object.entries(ranking).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ['', 0],
  )

  return (
    <Flex align='top' pb={4} gap={8}>
      <Stack align='center'>
        <Text fontWeight={600} fontSize={18}>
          Sugestão:
        </Text>
        <Flex
          key={card[0]}
          position={'relative'}
          p={2}
          cursor='pointer'
          w={{ base: '40px', xl: '60px' }}
          h={{ base: '60px', xl: '90px' }}
          bgColor='#FBFBFB'
          borderRadius='lg'
          align='center'
          justify='space-between'
          borderColor={'#F7C379'}
          borderWidth={3}
          direction='column'
          color={'#F7C379'}
          transition='all 0.3s ease-in-out'
        >
          <Text fontSize={8} fontWeight={700} w='full'>
            {card[0]}
          </Text>
          <Text fontSize={24} textAlign='center' fontWeight={800} w='full'>
            {card[0]}
          </Text>
          <Text fontSize={8} w='full' fontWeight={700} textAlign='end'>
            {card[0]}
          </Text>
          <CardsIcon
            position='absolute'
            w='65%'
            h='full'
            opacity={0.12}
            top={'50%'}
            transform='translate(0, -55%)'
          />
        </Flex>
        <Text fontSize={12} fontWeight={500} mt={2}>
          {card[1]} voto(s)
        </Text>
      </Stack>
      {!Number.isNaN(avg) && (
        <Stack align='center' ml={8}>
          <Text fontWeight={600} fontSize={18}>
            Média:
          </Text>
          <Text
            fontSize={48}
            textAlign='center'
            fontWeight={800}
            alignContent='center'
            w='full'
            h='70%'
          >
            {avg.toFixed(1)}
          </Text>
        </Stack>
      )}
    </Flex>
  )
}
