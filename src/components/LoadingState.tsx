interface LoadingStateProps {
  label?: string
  tone?: 'light' | 'dark'
}

export function LoadingState({ label = 'Carregando…', tone = 'light' }: LoadingStateProps) {
  const textColor = tone === 'dark' ? 'text-sand-2' : 'text-muted-2'
  const ringColor = tone === 'dark' ? 'border-ink-2 border-t-ocre' : 'border-sand-border border-t-terracota'

  return (
    <div className={`flex flex-1 flex-col items-center justify-center gap-3 py-16 ${textColor}`}>
      <div className={`h-7 w-7 animate-spin rounded-full border-[3px] ${ringColor}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
