import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { User } from '~/models/room'
import { renderWithProviders } from '~/test-utils'
import PollResults from './index'

function makeUser(uid: string, name: string, vote?: string): User {
  return { uid, name, vote }
}

describe('PollResults', () => {
  it('mostra mensagem quando não há votos', () => {
    renderWithProviders(<PollResults users={[makeUser('u1', 'Alice')]} />)
    expect(screen.getByText('Nenhum voto registrado')).toBeInTheDocument()
  })

  it('mostra mensagem quando todos os votos são vazios', () => {
    renderWithProviders(
      <PollResults
        users={[makeUser('u1', 'Alice', ''), makeUser('u2', 'Bob', '')]}
      />,
    )
    expect(screen.getByText('Nenhum voto registrado')).toBeInTheDocument()
  })

  it('calcula média correta para votos numéricos', () => {
    const users = [
      makeUser('u1', 'Alice', '5'),
      makeUser('u2', 'Bob', '3'),
      makeUser('u3', 'Carol', '8'),
    ]
    renderWithProviders(<PollResults users={users} />)
    // avg = (5 + 3 + 8) / 3 = 5.333...
    expect(screen.getByText('5.3')).toBeInTheDocument()
    expect(screen.getByText('Média:')).toBeInTheDocument()
  })

  it('mostra sugestão (voto mais frequente)', () => {
    const users = [
      makeUser('u1', 'Alice', '5'),
      makeUser('u2', 'Bob', '5'),
      makeUser('u3', 'Carol', '3'),
    ]
    renderWithProviders(<PollResults users={users} />)
    expect(screen.getByText('Sugestão:')).toBeInTheDocument()
    expect(screen.getByText('2 voto(s)')).toBeInTheDocument()
  })

  it('exclui votos não-numéricos da média', () => {
    const users = [
      makeUser('u1', 'Alice', '4'),
      makeUser('u2', 'Bob', '?'),
      makeUser('u3', 'Carol', '6'),
    ]
    renderWithProviders(<PollResults users={users} />)
    // avg = (4 + 6) / 2 = 5.0, '?' excluído
    expect(screen.getByText('5.0')).toBeInTheDocument()
  })

  it('mostra ranking com votos não-numéricos incluídos', () => {
    const users = [
      makeUser('u1', 'Alice', '?'),
      makeUser('u2', 'Bob', '?'),
      makeUser('u3', 'Carol', '5'),
    ]
    renderWithProviders(<PollResults users={users} />)
    expect(screen.getByText('2 votos')).toBeInTheDocument()
    expect(screen.getByText('1 voto')).toBeInTheDocument()
  })

  it('funciona com um único voto', () => {
    const users = [makeUser('u1', 'Alice', '8')]
    renderWithProviders(<PollResults users={users} />)
    expect(screen.getByText('8.0')).toBeInTheDocument()
    expect(screen.getByText('1 voto(s)')).toBeInTheDocument()
  })
})
