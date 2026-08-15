export function matchesQuery(texto: string, query: string): boolean {
  const palavras = query
    .toLowerCase()
    .split(/\s+/)
    .filter((palavra) => palavra.length >= 3)

  if (palavras.length === 0) return true

  const textoNormalizado = texto.toLowerCase()
  return palavras.some((palavra) => textoNormalizado.includes(palavra))
}
