import { describe, expect, it } from 'vitest'
import { generateRandomCode } from './randomCode'

describe('generateRandomCode', () => {
  it('retorna string no formato XXXX-XXXX com letras maiúsculas', () => {
    const code = generateRandomCode()
    expect(code).toMatch(/^[A-Z]{4}-[A-Z]{4}$/)
  })

  it('gera códigos únicos em chamadas consecutivas', () => {
    const codes = new Set(
      Array.from({ length: 50 }, () => generateRandomCode()),
    )
    expect(codes.size).toBe(50)
  })
})
