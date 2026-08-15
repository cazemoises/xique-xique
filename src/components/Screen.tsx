import type { ReactNode } from 'react'

interface ScreenProps {
  children: ReactNode
  variant?: 'card' | 'wide'
}

export function Screen({ children, variant = 'card' }: ScreenProps) {
  if (variant === 'wide') {
    return (
      <div className="min-h-screen bg-sand">
        <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream text-ink md:max-w-5xl">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand md:flex md:items-start md:justify-center md:bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(140,74,58,0.035),transparent_70%)] md:px-6 md:py-10">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream text-ink md:h-[calc(100vh-5rem)] md:min-h-0 md:overflow-y-auto md:rounded-[2rem] md:shadow-xl">
        {children}
      </div>
    </div>
  )
}
