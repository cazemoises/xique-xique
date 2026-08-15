import type { ReactNode } from 'react'

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream text-ink">
      {children}
    </div>
  )
}
