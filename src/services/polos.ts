import type { Polo } from '../domain/polo'

export async function getPolos(): Promise<Polo[]> {
  const res = await fetch('/api/polos')
  return res.json()
}
