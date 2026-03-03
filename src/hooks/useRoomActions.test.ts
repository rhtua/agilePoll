import { act, renderHook } from '@testing-library/react'
import type { User as FirebaseUser } from 'firebase/auth'
import type { Database } from 'firebase/database'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Room } from '~/models/room'
import { useRoomActions } from './useRoomActions'

const { mockGet, mockSet, mockUpdate, mockRemove, mockRef, mockPush } =
  vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockSet: vi.fn(),
    mockUpdate: vi.fn(),
    mockRemove: vi.fn(),
    mockRef: vi.fn(() => 'mock-ref'),
    mockPush: vi.fn(),
  }))

vi.mock('firebase/database', () => ({
  get: mockGet,
  set: mockSet,
  update: mockUpdate,
  remove: mockRemove,
  ref: mockRef,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const fakeUser = { uid: 'user-1' } as FirebaseUser
const fakeDb = {} as Database

const fakeRoom: Room = {
  code: 'ABCD-EFGH',
  name: 'Sprint 10',
  points: '1,2,3,5,8',
  revealVotes: false,
  createdAt: '2026-01-01T00:00:00Z',
  ownerUid: 'user-1',
  users: [{ uid: 'user-1', name: 'Alice', vote: '' }],
}

const mockSetRoom = vi.fn()

function setup(
  user: FirebaseUser | null = fakeUser,
  room: Room | null = fakeRoom,
) {
  return renderHook(() => useRoomActions(fakeDb, user, room, mockSetRoom))
}

function mockRoomSnapshot(overrides: Record<string, any> = {}) {
  return {
    val: () => ({
      ownerUid: 'user-1',
      users: { 'user-1': { uid: 'user-1', name: 'Alice', vote: '' } },
      ...overrides,
    }),
  }
}

describe('useRoomActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSet.mockResolvedValue(undefined)
    mockUpdate.mockResolvedValue(undefined)
    mockRemove.mockResolvedValue(undefined)
    sessionStorage.clear()
  })

  describe('createRoom', () => {
    it('cria sala com dados corretos e retorna o código', async () => {
      const { result } = setup()

      let code: string
      await act(async () => {
        code = await result.current.createRoom('Sprint 10', 'Alice', '1,2,3')
      })

      expect(code!).toMatch(/^[A-Z]{4}-[A-Z]{4}$/)

      // Verifica que ref() apontou pro path correto
      expect(mockRef).toHaveBeenCalledWith(fakeDb, `rooms/${code!}`)

      expect(mockSet).toHaveBeenCalledOnce()
      const roomData = mockSet.mock.calls[0][1]
      expect(roomData.name).toBe('Sprint 10')
      expect(roomData.ownerUid).toBe('user-1')
      expect(roomData.users['user-1'].name).toBe('Alice')

      // Verifica que setRoom foi chamado com users como array
      expect(mockSetRoom).toHaveBeenCalledOnce()
      const roomArg = mockSetRoom.mock.calls[0][0]
      expect(Array.isArray(roomArg.users)).toBe(true)
    })

    it('salva username no sessionStorage', async () => {
      const { result } = setup()

      let code: string
      await act(async () => {
        code = await result.current.createRoom('Sprint', 'Alice', '1,2,3')
      })

      expect(sessionStorage.getItem(code!)).toBe('Alice')
    })

    it('lança erro se user é null', async () => {
      const { result } = setup(null)

      await expect(
        act(() => result.current.createRoom('Sprint', 'Alice', '1,2,3')),
      ).rejects.toThrow('User must be authenticated')
    })
  })

  describe('joinRoom', () => {
    it('entra em sala existente', async () => {
      mockGet.mockResolvedValue(
        mockRoomSnapshot({ ownerUid: 'other', users: {} }),
      )

      const { result } = setup()

      await act(async () => {
        await result.current.joinRoom('ABCD-EFGH', 'Bob')
      })

      // Verifica ref path e dados do usuário
      expect(mockRef).toHaveBeenCalledWith(fakeDb, 'rooms/ABCD-EFGH')
      expect(mockSet).toHaveBeenCalledOnce()
      const userData = mockSet.mock.calls[0][1]
      expect(userData.name).toBe('Bob')
      expect(userData.uid).toBe('user-1')

      // Verifica sessionStorage
      expect(sessionStorage.getItem('ABCD-EFGH')).toBe('Bob')
    })

    it('lança erro se código é inválido', async () => {
      const { result } = setup()

      await expect(
        act(() => result.current.joinRoom('invalid', 'Bob')),
      ).rejects.toThrow('Código de sala inválido')
    })

    it('lança erro se sala não existe', async () => {
      mockGet.mockResolvedValue({ val: () => null })

      const { result } = setup()

      await expect(
        act(() => result.current.joinRoom('ABCD-EFGH', 'Bob')),
      ).rejects.toThrow('Room does not exist')
    })

    it('faz update ao invés de criar se user já existe na sala', async () => {
      mockGet.mockResolvedValue(mockRoomSnapshot({ ownerUid: 'other' }))

      const { result } = setup()

      await act(async () => {
        await result.current.joinRoom('ABCD-EFGH', 'NewName')
      })

      expect(mockUpdate).toHaveBeenCalledOnce()
      expect(mockSet).not.toHaveBeenCalled()
    })
  })

  describe('vote', () => {
    it('atualiza voto do usuário', async () => {
      mockGet.mockResolvedValue({ exists: () => true })

      const { result } = setup()

      await act(async () => {
        await result.current.vote('8')
      })

      expect(mockUpdate).toHaveBeenCalledWith('mock-ref', { vote: '8' })
    })

    it('lança erro se user é null', async () => {
      const { result } = setup(null)

      await expect(act(() => result.current.vote('5'))).rejects.toThrow(
        'User must be authenticated',
      )
    })

    it('lança erro se room é null', async () => {
      const { result } = setup(fakeUser, null)

      await expect(act(() => result.current.vote('5'))).rejects.toThrow(
        'Room not found',
      )
    })
  })

  describe('resetVotes', () => {
    it('limpa votos de todos os usuários', async () => {
      mockGet.mockResolvedValue(
        mockRoomSnapshot({
          users: {
            'user-1': { uid: 'user-1', name: 'Alice', vote: '5' },
            'user-2': { uid: 'user-2', name: 'Bob', vote: '8' },
          },
        }),
      )

      const { result } = setup()

      await act(async () => {
        await result.current.resetVotes()
      })

      expect(mockUpdate).toHaveBeenCalledOnce()
      const updateData = mockUpdate.mock.calls[0][1]
      expect(updateData.revealVotes).toBe(false)
      expect(updateData.users['user-1'].vote).toBe('')
      expect(updateData.users['user-2'].vote).toBe('')
    })

    it('lança erro se não é owner', async () => {
      mockGet.mockResolvedValue(mockRoomSnapshot({ ownerUid: 'someone-else' }))

      const { result } = setup()

      await expect(act(() => result.current.resetVotes())).rejects.toThrow(
        'Only the room owner can reset votes',
      )
    })
  })

  describe('toggleRevealVotes', () => {
    it('revela votos', async () => {
      mockGet.mockResolvedValue(mockRoomSnapshot())

      const { result } = setup()

      await act(async () => {
        await result.current.toggleRevealVotes(true)
      })

      expect(mockUpdate).toHaveBeenCalledWith('mock-ref', { revealVotes: true })
    })

    it('lança erro se não é owner', async () => {
      mockGet.mockResolvedValue(mockRoomSnapshot({ ownerUid: 'someone-else' }))

      const { result } = setup()

      await expect(
        act(() => result.current.toggleRevealVotes(true)),
      ).rejects.toThrow('Only the room owner can reveal votes')
    })
  })

  describe('transferOwnership', () => {
    it('transfere ownership para outro usuário', async () => {
      mockGet.mockResolvedValue(
        mockRoomSnapshot({
          users: {
            'user-1': { uid: 'user-1', name: 'Alice' },
            'user-2': { uid: 'user-2', name: 'Bob' },
          },
        }),
      )

      const { result } = setup()

      await act(async () => {
        await result.current.transferOwnership('user-2')
      })

      expect(mockUpdate).toHaveBeenCalledWith('mock-ref', {
        ownerUid: 'user-2',
      })
    })

    it('lança erro se não é owner', async () => {
      mockGet.mockResolvedValue(
        mockRoomSnapshot({ ownerUid: 'someone-else', users: {} }),
      )

      const { result } = setup()

      await expect(
        act(() => result.current.transferOwnership('user-2')),
      ).rejects.toThrow('Only the room owner can transfer ownership')
    })

    it('lança erro se target user não está na sala', async () => {
      mockGet.mockResolvedValue(mockRoomSnapshot())

      const { result } = setup()

      await expect(
        act(() => result.current.transferOwnership('user-99')),
      ).rejects.toThrow('Target user is not in the room')
    })
  })

  describe('leaveRoom', () => {
    it('remove o usuário e redireciona pra home', async () => {
      mockGet.mockResolvedValue({
        val: () => ({ uid: 'user-1', name: 'Alice' }),
      })

      const { result } = setup()

      await act(async () => {
        await result.current.leaveRoom()
      })

      expect(mockRemove).toHaveBeenCalledOnce()
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(mockSetRoom).toHaveBeenCalledWith(null)
    })

    it('não faz nada se user é null', async () => {
      const { result } = setup(null)

      await act(async () => {
        await result.current.leaveRoom()
      })

      expect(mockRemove).not.toHaveBeenCalled()
    })
  })
})
