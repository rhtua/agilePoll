'use client'
import {
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  HStack,
  Image,
  Portal,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaUsers, FaBolt, FaChartBar, FaArrowRight } from 'react-icons/fa'
import { RoomForm } from '~/components/RoomForm'

const HERO_CARDS = ['0.5', '1', '1.5', '2', '2.5', '3']

const FEATURES = [
  {
    icon: FaUsers,
    title: 'Colaboração em tempo real',
    description:
      'Toda a equipe vota simultaneamente, aumentando a eficiência das reuniões.',
    gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
  },
  {
    icon: FaBolt,
    title: 'Rápido e simples',
    description:
      'Crie uma sala em segundos, compartilhe o código e comece a votar imediatamente.',
    gradient: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
  },
  {
    icon: FaChartBar,
    title: 'Resultados instantâneos',
    description:
      'Veja a média e a distribuição dos votos em tempo real para decisões ágeis.',
    gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
  },
]

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Flex
      direction='column'
      w='full'
      minH='100vh'
      className='landing-bg'
      overflow='hidden'
    >
      {/* ─── Hero ─── */}
      <Flex
        as='section'
        maxW='1200px'
        mx='auto'
        px={{ base: 5, md: 8 }}
        py={{ base: 12, md: 20 }}
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 10, md: 12 }}
        align='center'
        w='full'
        flex={1}
      >
        {/* Hero Text */}
        <Stack
          flex={1}
          gap={6}
          className='animate-fade-in-up'
        >
          <Heading
            as='h1'
            fontSize={{ base: '3xl', md: '5xl', xl: '6xl' }}
            fontWeight='800'
            color='var(--color-text)'
            lineHeight='1.1'
          >
            Planning Poker
            <Text
              as='span'
              display='block'
              mt={2}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Simplificado
            </Text>
          </Heading>
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            color='var(--color-text-secondary)'
            lineHeight='1.7'
            maxW='500px'
          >
            Estime suas tarefas de forma colaborativa com sua equipe ágil.
            Rápido, simples e eficiente.
          </Text>
          <HStack gap={4} flexWrap='wrap'>
            <Button
              size='lg'
              px={8}
              py={6}
              fontWeight='700'
              fontSize='lg'
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
              }}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(234, 88, 12, 0.4)',
              }}
              transition='all 0.2s ease'
              onClick={() => setIsModalOpen(true)}
            >
              Criar sala grátis
              <FaArrowRight />
            </Button>
            <Button
              size='lg'
              px={8}
              py={6}
              fontWeight='600'
              fontSize='lg'
              variant='outline'
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                borderRadius: '12px',
              }}
              _hover={{
                transform: 'translateY(-2px)',
                bg: 'var(--color-primary-light)',
              }}
              transition='all 0.2s ease'
              onClick={() => setIsModalOpen(true)}
            >
              Entrar em uma sala
            </Button>
          </HStack>
        </Stack>

        {/* Hero Card Preview */}
        <Flex
          flex={1}
          justify='center'
          className='animate-fade-in-scale delay-200'
        >
          <Box
            bg='white'
            borderRadius='2xl'
            p={{ base: 5, md: 8 }}
            w='full'
            maxW='450px'
            boxShadow='0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px var(--color-border)'
          >
            {/* Window dots */}
            <HStack gap={2} mb={6}>
              <Box w='10px' h='10px' borderRadius='full' bg='#EF4444' />
              <Box w='10px' h='10px' borderRadius='full' bg='#F59E0B' />
              <Box w='10px' h='10px' borderRadius='full' bg='#22C55E' />
            </HStack>

            {/* Cards preview */}
            <HStack justify='center' gap={2} mb={6}>
              {HERO_CARDS.map((value, i) => (
                <Box
                  key={value}
                  h={{ base: '60px', md: '72px' }}
                  w={{ base: '40px', md: '48px' }}
                  borderRadius='lg'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  fontWeight='800'
                  fontSize={{ base: 'md', md: 'lg' }}
                  boxShadow={
                    i === 3
                      ? '0 4px 16px var(--color-accent-glow)'
                      : '0 2px 6px rgba(0,0,0,0.06)'
                  }
                  style={{
                    background:
                      i === 3
                        ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                        : 'linear-gradient(180deg, #F8FAFC, #F1F5F9)',
                    color: i === 3 ? 'white' : 'var(--color-card-text)',
                    transform: i === 3 ? 'scale(1.1)' : 'scale(1)',
                    animation: `card-stagger 0.5s ease-out ${0.3 + i * 0.08}s both`,
                  }}
                >
                  {value}
                </Box>
              ))}
            </HStack>

            {/* Result preview */}
            <Box
              bg='var(--color-surface-dim)'
              borderRadius='lg'
              p={4}
              textAlign='center'
            >
              <Text fontSize='sm' color='var(--color-text-muted)' mb={1}>
                4 de 4 participantes votaram
              </Text>
              <HStack justify='center' gap={6}>
                <Stack gap={0} align='center'>
                  <Text fontSize='xs' color='var(--color-text-muted)'>
                    Média
                  </Text>
                  <Text fontSize='2xl' fontWeight='800' color='var(--color-text)'>
                    2.1
                  </Text>
                </Stack>
                <Stack gap={0} align='center'>
                  <Text fontSize='xs' color='var(--color-text-muted)'>
                    Sugestão
                  </Text>
                  <Text
                    fontSize='2xl'
                    fontWeight='800'
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    2
                  </Text>
                </Stack>
              </HStack>
            </Box>
          </Box>
        </Flex>
      </Flex>

      {/* ─── Features ─── */}
      <Box
        as='section'
        maxW='1200px'
        mx='auto'
        px={{ base: 5, md: 8 }}
        py={{ base: 12, md: 20 }}
        w='full'
      >
        <Heading
          as='h2'
          fontSize={{ base: '2xl', md: '4xl' }}
          fontWeight='800'
          textAlign='center'
          color='var(--color-text)'
          mb={{ base: 8, md: 16 }}
        >
          Por que usar o AgilePoll?
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          {FEATURES.map((feature, i) => (
            <Box
              key={feature.title}
              bg='white'
              borderRadius='xl'
              p={8}
              boxShadow='0 4px 16px rgba(0,0,0,0.04), 0 0 0 1px var(--color-border)'
              transition='all 0.3s ease'
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 0 0 1px var(--color-border)',
              }}
              style={{
                animation: `fade-in-up 0.5s ease-out ${0.1 + i * 0.1}s both`,
              }}
            >
              <Flex
                w='52px'
                h='52px'
                borderRadius='lg'
                align='center'
                justify='center'
                mb={5}
                color='white'
                fontSize='xl'
                style={{ background: feature.gradient }}
              >
                <feature.icon />
              </Flex>
              <Text
                fontSize='xl'
                fontWeight='700'
                color='var(--color-text)'
                mb={3}
              >
                {feature.title}
              </Text>
              <Text
                color='var(--color-text-secondary)'
                lineHeight='1.7'
              >
                {feature.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* ─── CTA ─── */}
      <Box
        as='section'
        maxW='1200px'
        mx='auto'
        px={{ base: 5, md: 8 }}
        py={{ base: 8, md: 16 }}
        w='full'
      >
        <Box
          borderRadius='2xl'
          p={{ base: 8, md: 12 }}
          textAlign='center'
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
            boxShadow: '0 20px 60px rgba(234, 88, 12, 0.25)',
          }}
        >
          <Heading
            as='h2'
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight='800'
            color='white'
            mb={4}
          >
            Pronto para começar?
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'xl' }}
            color='rgba(255,255,255,0.85)'
            mb={8}
          >
            Crie sua primeira sala de Planning Poker agora mesmo, é grátis!
          </Text>
          <Button
            size='lg'
            px={8}
            py={6}
            fontWeight='700'
            fontSize='lg'
            bg='white'
            style={{
              color: 'var(--color-primary)',
              borderRadius: '12px',
            }}
            _hover={{
              transform: 'translateY(-2px)',
              bg: 'gray.100',
            }}
            transition='all 0.2s ease'
            onClick={() => setIsModalOpen(true)}
          >
            Criar sala agora
            <FaArrowRight />
          </Button>
        </Box>
      </Box>

      {/* ─── Footer ─── */}
      <Box
        as='footer'
        borderTop='1px solid var(--color-border)'
        mt='auto'
      >
        <Flex
          maxW='1200px'
          mx='auto'
          px={{ base: 5, md: 8 }}
          py={8}
          justify='space-between'
          align='center'
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <HStack gap={2}>
            <Image
              src='/agilePollV2.svg'
              alt='AgilePoll'
              height={{ base: '28px', md: '36px' }}
              width='auto'
              style={{ objectFit: 'contain' }}
            />
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight='700'
              color='var(--color-text)'
              letterSpacing='-0.02em'
            >
              Agile
              <Text
                as='span'
                fontWeight='700'
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #EA580C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Poll
              </Text>
            </Text>
          </HStack>
          <Text color='var(--color-text-muted)' fontSize='sm'>
            © 2026 AgilePoll. Facilitando estimativas ágeis.
          </Text>
        </Flex>
      </Box>

      {/* ─── Room Form Modal ─── */}
      <Dialog.Root
        open={isModalOpen}
        onOpenChange={(e) => setIsModalOpen(e.open)}
        placement='center'
        size='lg'
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              borderRadius='xl'
              p={0}
              overflow='hidden'
            >
              <Dialog.Header
                px={6}
                py={4}
                borderBottom='1px solid var(--color-border)'
              >
                <Dialog.Title fontWeight='700' fontSize='lg'>
                  Criar ou entrar em uma sala
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body px={0} py={0}>
                <Flex justify='center' py={6}>
                  <RoomForm />
                </Flex>
              </Dialog.Body>
              <Dialog.CloseTrigger
                position='absolute'
                top={3}
                right={3}
              />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  )
}
