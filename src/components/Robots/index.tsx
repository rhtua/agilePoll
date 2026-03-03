'use client'
import { Flex, Text } from '@chakra-ui/react'

interface RobotProps {
  avatar: string
  name: string
  vote?: string
  revealVotes: boolean
}

export default function Robot({ avatar, name, vote, revealVotes }: RobotProps) {
  return (
    <Flex
      bgImage={`url(${avatar})`}
      bgSize={'100% 100%'}
      h={'5rem'}
      w={'3.3rem'}
      position='relative'
      borderRadius='lg'
      transition='transform 0.2s ease, box-shadow 0.2s ease'
      _hover={{
        transform: 'scale(1.08)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      {vote && vote !== '' && revealVotes && (
        <Flex
          align='center'
          justify='center'
          w='full'
          h='full'
          bgColor={'rgba(30, 41, 59, 0.88)'}
          borderRadius='lg'
          className='animate-fade-in-scale'
        >
          <Text fontWeight={700} fontSize='3xl' color='white' zIndex={3}>
            {vote}
          </Text>
        </Flex>
      )}
      <Flex
        w='fit-content'
        maxW='70px'
        h='fit-content'
        position='absolute'
        bottom={0}
        left='50%'
        transform='translateX(-50%) translateY(50%)'
        bgColor={'var(--color-surface)'}
        borderRadius='lg'
        align={'center'}
        justify={'center'}
        borderColor={'var(--color-border-strong)'}
        borderWidth={1}
        px={1}
        py={0.5}
        fontSize='sm'
        overflow='hidden'
        boxShadow='0 1px 4px rgba(0,0,0,0.06)'
      >
        <Text truncate color='var(--color-text)'>
          {name}
        </Text>
      </Flex>
    </Flex>
  )
}
