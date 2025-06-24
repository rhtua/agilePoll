import type { User } from '~/models/room'

const ROBOT_AVATAR_URL = 'https://api.dicebear.com/9.x/bottts-neutral/png?seed='

export type RobotType = {
  avatar: string
  name: string
  vote: string | undefined
}

export default function mapUsersToRobots(users: User[] | undefined): {
  firstHalf: RobotType[]
  secondHalf: RobotType[]
} {
  if (!users || users?.length === 0) return { firstHalf: [], secondHalf: [] }

  const robots =
    users?.map((user) => {
      return {
        avatar: `${ROBOT_AVATAR_URL}${user.uid}`,
        name: user.name,
        vote: user.vote,
      }
    }) ?? []

  const halfLength = Math.ceil(robots.length / 2)

  const firstHalf = robots.slice(0, halfLength)
  const secondHalf = robots.slice(halfLength)

  return {
    firstHalf,
    secondHalf,
  }
}
