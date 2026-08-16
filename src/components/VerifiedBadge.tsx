interface VerifiedBadgeProps {
  onClick: () => void
}

export function VerifiedBadge({ onClick }: VerifiedBadgeProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className="flex items-center gap-1 rounded-full bg-verified-bg px-1.5 py-0.5 font-sans text-2xs font-semibold tracking-wide text-oliva transition-colors hover:bg-[#e3dfc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oliva focus-visible:ring-offset-1"
    >
      VERIFICADA <span className="font-extrabold">ⓘ</span>
    </button>
  )
}
