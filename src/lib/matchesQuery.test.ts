import { describe, expect, test } from 'vitest'
import { matchesQuery } from './matchesQuery'

describe('matchesQuery', () => {
  test('casa quando o texto contém alguma palavra relevante da busca', () => {
    expect(matchesQuery('Vestido longo fenda preto', 'vestido de festa')).toBe(true)
  })

  test('não casa quando nenhuma palavra relevante aparece no texto', () => {
    expect(matchesQuery('Blusa cropped canelada', 'vestido de festa')).toBe(false)
  })

  test('quando todas as palavras da busca são muito curtas, trata como busca vazia e casa com tudo', () => {
    expect(matchesQuery('Saia midi plissada', 'de')).toBe(true)
  })

  test('busca vazia casa com qualquer texto', () => {
    expect(matchesQuery('Qualquer coisa', '')).toBe(true)
  })
})
