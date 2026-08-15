import { describe, expect, test } from 'vitest'
import { formatEta } from './formatEta'

describe('formatEta', () => {
  test('mostra um único valor quando min e max são iguais', () => {
    expect(formatEta({ min: 70, max: 70 })).toBe('70 min')
  })

  test('mostra o intervalo quando min e max são diferentes', () => {
    expect(formatEta({ min: 40, max: 60 })).toBe('40–60 min')
  })
})
