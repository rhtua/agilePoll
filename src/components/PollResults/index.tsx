'use client'
import { Flex, Stack, Text } from '@chakra-ui/react'
import type { User } from '~/models/room'
import { CardsIcon } from '../Cards'

interface CardsProps {
  users: User[]
}

export default function PollResults({ users }: CardsProps) {
  const votes = users.map((user) => user.vote).filter((v) => Boolean(v))

  if (votes.length === 0) {
    return (
      <Flex align='center' pb={4} className='animate-slide-up'>
        <Text
          fontSize={16}
          color='var(--color-text-secondary)'
          fontWeight={500}
        >
          Nenhum voto registrado
        </Text>
      </Flex>
    )
  }

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
    <Flex
      align='top'
      pb={4}
      gap={{ base: 3, md: 8 }}
      className='animate-slide-up'
    >
      <Stack align='center'>
        <Text fontWeight={600} fontSize={18}>
          Sugestão:
        </Text>
        <Flex
          key={card[0]}
          position={'relative'}
          py={2}
          cursor='pointer'
          w={{ base: '40px', xl: '60px' }}
          h={{ base: '60px', xl: '90px' }}
          bgColor='#FBFBFB'
          borderRadius='lg'
          align='center'
          justify='space-between'
          borderColor={'var(--color-accent)'}
          borderWidth={3}
          direction='column'
          color={'var(--color-accent)'}
          transition='all 0.3s ease-in-out'
          boxShadow='0 0 12px var(--color-accent-glow)'
        >
          <Text
            fontSize={8}
            fontWeight={700}
            w='full'
            pl={2}
            display={{ base: 'none', xl: 'block' }}
          >
            {card[0]}
          </Text>
          <Text
            fontSize={24}
            textAlign='center'
            fontWeight={800}
            w='full'
            whiteSpace='preserve nowrap'
            mx='auto'
          >
            {card[0]}
          </Text>
          <Text
            fontSize={8}
            w='full'
            fontWeight={700}
            pr={2}
            textAlign='end'
            display={{ base: 'none', xl: 'block' }}
          >
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
            fontSize={{ base: 30, md: 48 }}
            textAlign='center'
            fontWeight={800}
            alignContent='center'
            w='full'
            h='70%'
            color='var(--color-text)'
          >
            {avg.toFixed(1)}
          </Text>
        </Stack>
      )}

      <Stack
        align='flex-start'
        ml={{ base: 0, sm: 8 }}
        mt={{ base: 4, sm: 0 }}
        justify='center'
        minW='200px'
      >
        <Text fontWeight={600} fontSize={18} mb={2}>
          Votos:
        </Text>
        <Stack gap={2} w='full'>
          {Object.entries(ranking)
            .sort((a, b) => b[1] - a[1])
            .map(([voteStr, count]) => {
              const widthPerc = Math.round((count / totalVotes) * 100)
              return (
                <Flex key={voteStr} align='center' gap={3} w='full'>
                  <Text fontWeight={700} w='30px' textAlign='right'>
                    {voteStr}
                  </Text>
                  <Flex
                    bg='orange.100'
                    h='12px'
                    borderRadius='full'
                    flex={1}
                    maxW={{ base: '100px', md: '150px' }}
                    overflow='hidden'
                  >
                    <Flex
                      h='full'
                      borderRadius='full'
                      w={`${widthPerc}%`}
                      transition='width 0.5s'
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                  </Flex>
                  <Text fontSize={12} color='gray.600' w='50px'>
                    {count} {count === 1 ? 'voto' : 'votos'}
                  </Text>
                </Flex>
              )
            })}
        </Stack>
      </Stack>
    </Flex>
  )
}
