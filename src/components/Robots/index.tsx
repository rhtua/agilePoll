'use client'
import { Flex, Text } from '@chakra-ui/react'

interface RobotProps {
  avatar: string
  name: string
}

export default function Robot({ avatar, name }: RobotProps) {
  return (
    <Flex
      bgImage={`url(${avatar})`}
      bgSize={'100% 100%'}
      w={{ base: '40px', xl: '56px' }}
      h={{ base: '70px', xl: '86px' }}
      position='relative'
      align='end'
      justify='center'
      borderRadius='lg'
    >
      <Flex
        w='fit-content'
        maxW='70px'
        h='fit-content'
        position='absolute'
        bottom={0}
        left='50%'
        transform='translateX(-50%) translateY(50%)'
        bgColor={'#FBFBFB'}
        borderRadius='lg'
        align={'center'}
        justify={'center'}
        borderColor={'#575757'}
        borderWidth={1}
        px={1}
        py={0.5}
        fontSize='sm'
        overflow='hidden'
      >
        <Text truncate>{name}</Text>
      </Flex>
    </Flex>
  )
}
