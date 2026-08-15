import { describe, expect, test } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  test('formata valor com casas decimais e separador brasileiro', () => {
    expect(formatPrice(89.9)).toBe('R$ 89,90')
  })

  test('formata valor inteiro com duas casas decimais', () => {
    expect(formatPrice(120)).toBe('R$ 120,00')
  })
})
