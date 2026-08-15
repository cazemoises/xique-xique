import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface ScreenProps {
  children: ReactNode
  variant?: 'card' | 'wide'
}

export function Screen({ children, variant = 'card' }: ScreenProps) {
  if (variant === 'wide') {
    return (
      <div className="min-h-screen bg-sand lg:bg-cream">
        <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream text-ink md:max-w-5xl lg:max-w-none">
          {children}
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand md:flex md:items-start md:justify-center md:bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(140,74,58,0.035),transparent_70%)] md:px-6 md:py-10 lg:block lg:bg-cream lg:px-0 lg:py-0">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream text-ink md:min-h-0 md:max-h-[calc(100vh-5rem)] md:overflow-y-auto md:rounded-[2rem] md:shadow-xl lg:max-w-none lg:max-h-none lg:overflow-visible lg:rounded-none lg:shadow-none">
        {children}
      </div>
    </div>
  )
}
