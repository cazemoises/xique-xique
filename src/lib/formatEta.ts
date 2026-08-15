export function formatEta(etaMinutos: { min: number; max: number }): string {
  if (etaMinutos.min === etaMinutos.max) return `${etaMinutos.min} min`
  return `${etaMinutos.min}–${etaMinutos.max} min`
}
