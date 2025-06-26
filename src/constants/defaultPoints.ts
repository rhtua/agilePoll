import { createListCollection } from '@chakra-ui/react'

const FibonacciPoints = {
  name: 'Fibonacci',
  points: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '?', '☕︎'],
}

const TShirtPoints = {
  name: 'Camiseta',
  points: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕︎'],
}

const DefaultPoints = {
  name: 'Padrão',
  points: ['0.5', '1', '1.5', '2', '2.5', '3', '?', '☕︎'],
}

const Custom = {
  name: 'Customizado',
  points: [],
}

export const SuggestedPoints = [
  FibonacciPoints,
  TShirtPoints,
  DefaultPoints,
  Custom,
]

export function createSelectPointOptions() {
  return createListCollection({
    items: SuggestedPoints.map((i) => {
      return {
        label: i.name,
        value: i.points.join(' ,'),
      }
    }),
  })
}
