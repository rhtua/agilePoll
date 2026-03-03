import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { type RenderOptions, render } from '@testing-library/react'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { RoomContext } from '~/contexts/room'

type RoomContextValue = ComponentProps<typeof RoomContext.Provider>['value']

export const defaultRoomContext: RoomContextValue = {
  user: null,
  room: null,
  isLoading: false,
  database: null,
  createRoom: async () => '',
  joinRoom: async () => {},
  leaveRoom: async () => {},
  vote: async () => {},
  resetVotes: async () => {},
  toggleRevealVotes: async () => {},
  transferOwnership: async () => {},
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  roomContext?: Partial<RoomContextValue>
}

export function renderWithProviders(
  ui: ReactElement,
  { roomContext, ...options }: CustomRenderOptions = {},
) {
  const contextValue = { ...defaultRoomContext, ...roomContext }

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ChakraProvider value={defaultSystem}>
        <RoomContext.Provider value={contextValue}>
          {children}
        </RoomContext.Provider>
      </ChakraProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}
