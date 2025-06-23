import {
  Button,
  Field,
  Flex,
  HStack,
  Input,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react'

export default function Home() {
  return (
    <Flex
      p={3}
      justify='center'
      w='full'
      h='full'
      bgImage="url('/homeBg.png')"
      bgSize='100% 100%'
      bgRepeat='no-repeat'
    >
      <Stack align='center' mt={5}>
        <Text fontSize='4xl' fontWeight='bold' textAlign='start' w='full'>
          Planning Poker
        </Text>
        <Text
          fontSize='lg  '
          fontWeight='400'
          textAlign='start'
          w='full'
          mb={3}
        >
          Crie ou entre em uma sala, convide participantes e comece a votar
        </Text>
        <Flex
          w={{ base: '80vw', md: '50vw' }}
          direction='column'
          maxH='60vh'
          align='center'
          bgColor='white'
          gap={5}
          borderRadius='lg'
          shadow='xl'
          px={5}
          py={8}
        >
          <Field.Root required>
            <Field.Label>Nome da sala</Field.Label>
            <Input placeholder='Escolha o nome da sala' />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Pontuação</Field.Label>
            <Input placeholder='0,1,1.5,2,2.5,3,4,5' />
          </Field.Root>

          <Button
            colorPalette='orange'
            px={10}
            size='md'
            style={{
              backgroundColor: '#DD6B20',
              fontWeight: 600,
              fontSize: 16,
              color: 'white',
            }}
          >
            Criar sala
          </Button>
          <HStack w={'40%'}>
            <Separator colorPalette='orange' flex='1' />
            <Text flexShrink='0'>ou</Text>
            <Separator flex='1' />
          </HStack>
          <Field.Root required>
            <Field.Label>Código da sala</Field.Label>
            <Input placeholder='AAAA-BBBB' />
          </Field.Root>
          <Button
            px={7}
            colorPalette='orange'
            variant='outline'
            size='md'
            style={{
              borderColor: '#DD6B20',
              fontWeight: 600,
              fontSize: 16,
              color: '#DD6B20',
            }}
          >
            Entrar na sala
          </Button>
        </Flex>
      </Stack>
    </Flex>
  )
}
