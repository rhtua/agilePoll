import { describe, expect, it } from 'vitest'
import type { User } from '~/models/room'
import mapUsersToRobots, { ROBOT_AVATAR_URL } from './usersToRobots'

const makeUser = (uid: string, name: string, vote?: string): User => ({
  uid,
  name,
  vote,
})

describe('mapUsersToRobots', () => {
  it('retorna listas vazias quando users é undefined', () => {
    const result = mapUsersToRobots(undefined)
    expect(result).toEqual({ firstHalf: [], secondHalf: [] })
  })

  it('retorna listas vazias quando users é array vazio', () => {
    const result = mapUsersToRobots([])
    expect(result).toEqual({ firstHalf: [], secondHalf: [] })
  })

  it('1 usuário -> firstHalf com 1 item, secondHalf vazio', () => {
    const users = [makeUser('u1', 'Alice')]
    const result = mapUsersToRobots(users)

    expect(result.firstHalf).toHaveLength(1)
    expect(result.secondHalf).toHaveLength(0)
  })

  it('2 usuários -> 1 em cada metade', () => {
    const users = [makeUser('u1', 'Alice'), makeUser('u2', 'Bob')]
    const result = mapUsersToRobots(users)

    expect(result.firstHalf).toHaveLength(1)
    expect(result.secondHalf).toHaveLength(1)
  })

  it('3 usuários -> 2 na primeira, 1 na segunda (ceil)', () => {
    const users = [
      makeUser('u1', 'Alice'),
      makeUser('u2', 'Bob'),
      makeUser('u3', 'Carol'),
    ]
    const result = mapUsersToRobots(users)

    expect(result.firstHalf).toHaveLength(2)
    expect(result.secondHalf).toHaveLength(1)
  })

  it('gera avatar com a URL do dicebear + uid', () => {
    const users = [makeUser('abc123', 'Alice')]
    const result = mapUsersToRobots(users)

    expect(result.firstHalf[0].avatar).toBe(`${ROBOT_AVATAR_URL}abc123`)
  })

  it('mapeia name e vote corretamente', () => {
    const users = [makeUser('u1', 'Alice', '5')]
    const result = mapUsersToRobots(users)

    expect(result.firstHalf[0].name).toBe('Alice')
    expect(result.firstHalf[0].vote).toBe('5')
  })

  it('vote undefined quando usuário não votou', () => {
    const users = [makeUser('u1', 'Alice')]
    const result = mapUsersToRobots(users)

    expect(result.firstHalf[0].vote).toBeUndefined()
  })
})
