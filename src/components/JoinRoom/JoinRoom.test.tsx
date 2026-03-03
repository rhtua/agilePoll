import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Room } from '~/models/room'
import { renderWithProviders } from '~/test-utils'
import JoinRoomComponent from './index'

const { mockPush } = vi.hoisted(() => ({
  mockPush: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const fakeRoom: Room = {
  code: 'ABCD-EFGH',
  name: 'Sprint 10',
  points: '1,2,3,5,8',
  revealVotes: false,
  createdAt: '2026-01-01T00:00:00Z',
  ownerUid: 'user-1',
  users: [{ uid: 'user-1', name: 'Alice', vote: '' }],
}

describe('JoinRoomComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
    sessionStorage.clear()
  })

  it('mostra o nome da sala e formulário', () => {
    renderWithProviders(<JoinRoomComponent />, {
      roomContext: { room: fakeRoom },
    })
    expect(screen.getByText('Sprint 10')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite o seu nome')).toBeInTheDocument()
    expect(screen.getByText('Entrar na sala')).toBeInTheDocument()
  })

  it('mostra spinner de auto-join quando sessionStorage tem username', () => {
    sessionStorage.setItem('ABCD-EFGH', 'Alice')
    renderWithProviders(<JoinRoomComponent />, {
      roomContext: { room: fakeRoom },
    })
    expect(screen.getByText('Entrando na sala...')).toBeInTheDocument()
    expect(screen.queryByText('Entrar na sala')).not.toBeInTheDocument()
  })

  it('chama joinRoom ao submeter o formulário', async () => {
    const mockJoinRoom = vi.fn().mockResolvedValue(undefined)
    renderWithProviders(<JoinRoomComponent />, {
      roomContext: { room: fakeRoom, joinRoom: mockJoinRoom },
    })

    const input = screen.getByPlaceholderText('Digite o seu nome')
    fireEvent.change(input, { target: { value: 'Bob' } })
    fireEvent.click(screen.getByText('Entrar na sala'))

    await waitFor(() => {
      expect(mockJoinRoom).toHaveBeenCalledWith('ABCD-EFGH', 'Bob')
    })
  })

  it('redireciona pra / em caso de erro ao entrar', async () => {
    const mockJoinRoom = vi.fn().mockRejectedValue(new Error('fail'))
    renderWithProviders(<JoinRoomComponent />, {
      roomContext: { room: fakeRoom, joinRoom: mockJoinRoom },
    })

    const input = screen.getByPlaceholderText('Digite o seu nome')
    fireEvent.change(input, { target: { value: 'Bob' } })
    fireEvent.click(screen.getByText('Entrar na sala'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('não renderiza conteúdo de sala quando room é null', () => {
    renderWithProviders(<JoinRoomComponent />, {
      roomContext: { room: null },
    })
    expect(screen.queryByText('Sprint 10')).not.toBeInTheDocument()
    expect(screen.queryByText('Entrar na sala')).toBeInTheDocument()
  })
})
