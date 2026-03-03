import { fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RobotType } from '~/mappers/usersToRobots'
import { renderWithProviders } from '~/test-utils'
import VotingTable from './index'

const makeRobot = (name: string, vote?: string): RobotType => ({
  avatar: `https://example.com/${name}`,
  name,
  vote,
})

function defaultProps(
  overrides: Partial<Parameters<typeof VotingTable>[0]> = {},
) {
  return {
    firstHalf: [makeRobot('Alice', '5')],
    secondHalf: [makeRobot('Bob', '3')],
    revealVotes: false,
    hasPendingVotes: true,
    hasVotes: true,
    isRoomOwner: true,
    onPoll: vi.fn(),
    ...overrides,
  }
}

describe('VotingTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mostra "Aguardando votos..." quando há votos pendentes', () => {
    renderWithProviders(<VotingTable {...defaultProps()} />)
    expect(screen.getByText('Aguardando votos...')).toBeInTheDocument()
  })

  it('mostra "Votação concluída!" quando todos votaram', () => {
    renderWithProviders(
      <VotingTable {...defaultProps({ hasPendingVotes: false })} />,
    )
    expect(screen.getByText('Votação concluída!')).toBeInTheDocument()
  })

  it('mostra botão "Revelar votos" para o owner quando não revelados', () => {
    renderWithProviders(<VotingTable {...defaultProps()} />)
    expect(screen.getByText('Revelar votos')).toBeInTheDocument()
  })

  it('mostra botão "Nova votação" para o owner quando votos revelados', () => {
    renderWithProviders(
      <VotingTable
        {...defaultProps({ revealVotes: true, hasPendingVotes: false })}
      />,
    )
    expect(screen.getByText('Nova votação')).toBeInTheDocument()
  })

  it('não mostra botão de ação para não-owner', () => {
    renderWithProviders(
      <VotingTable {...defaultProps({ isRoomOwner: false })} />,
    )
    expect(screen.queryByText('Revelar votos')).not.toBeInTheDocument()
    expect(screen.queryByText('Nova votação')).not.toBeInTheDocument()
  })

  it('não mostra botão quando não há votos', () => {
    renderWithProviders(<VotingTable {...defaultProps({ hasVotes: false })} />)
    expect(screen.queryByText('Revelar votos')).not.toBeInTheDocument()
  })

  it('chama onPoll ao clicar no botão', () => {
    const onPoll = vi.fn()
    renderWithProviders(<VotingTable {...defaultProps({ onPoll })} />)
    fireEvent.click(screen.getByText('Revelar votos'))
    expect(onPoll).toHaveBeenCalledOnce()
  })
})
