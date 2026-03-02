import { Flex, HStack, Stack, type StackProps } from '@chakra-ui/react'
import { FaCheckCircle, FaClock } from 'react-icons/fa'
import Robot from '~/components/Robots'
import type { RobotType } from '~/mappers/usersToRobots'
import './animateRobots.css'

interface CreateRobotsProps extends StackProps {
  robots: RobotType[]
  isFirstRow: boolean
  revealVotes?: boolean
}

export function CreateRobots({
  robots,
  isFirstRow,
  revealVotes = false,
  ...rest
}: CreateRobotsProps) {
  if (!robots || robots.length === 0) return null

  const speed = robots.length > 4 ? robots.length * 1000 : 0

  return (
    <HStack
      w={'full'}
      justify={{
        base: 'space-evenly',
        md:
          robots.length % 2 === 0 && robots.length > 2
            ? 'space-between'
            : 'space-evenly',
      }}
      gap={10}
      style={{ ['--speed' as any]: `${speed}ms` }}
      {...rest}
    >
      {robots.map((robot) => (
        <Stack
          key={robot.avatar}
          align={'center'}
          gap={isFirstRow ? 2 : 5}
          direction={isFirstRow ? 'column' : 'column-reverse'}
        >
          {robot.vote ? (
            <FaCheckCircle
              color='var(--color-success)'
              className='animate-pop'
            />
          ) : (
            <FaClock
              color='var(--color-waiting)'
              className='animate-pulse-soft'
            />
          )}
          <Robot
            avatar={robot.avatar}
            name={robot.name}
            vote={robot.vote}
            revealVotes={revealVotes}
          />
        </Stack>
      ))}
    </HStack>
  )
}

export function CreateMobileRobots({
  robots,
  isFirstRow,
  revealVotes = false,
  ...rest
}: CreateRobotsProps) {
  const robotsEnoughForScroll = robots.length > 4

  return (
    <Flex
      w={{ base: !robotsEnoughForScroll ? 'full' : '100vw', md: 'full' }}
      h='full'
      minH={'6rem'}
      justify='center'
      className='inner'
      {...rest}
    >
      {robots.length > 4 ? (
        <Flex className='wrapper' w={'full'}>
          <CreateRobots
            robots={robots}
            isFirstRow={isFirstRow}
            revealVotes={revealVotes}
            className='section'
          />
          <CreateRobots
            robots={robots}
            isFirstRow={isFirstRow}
            revealVotes={revealVotes}
            className='section'
          />
          <CreateRobots
            robots={robots}
            isFirstRow={isFirstRow}
            revealVotes={revealVotes}
            className='section'
          />
        </Flex>
      ) : (
        <CreateRobots
          robots={robots}
          isFirstRow={isFirstRow}
          revealVotes={revealVotes}
          mr={10}
        />
      )}
    </Flex>
  )
}
