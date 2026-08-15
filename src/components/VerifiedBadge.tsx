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
      className="flex items-center gap-1 rounded-full bg-verified-bg px-1.5 py-0.5 font-sans text-[9px] font-semibold tracking-wide text-oliva"
    >
      VERIFICADA <span className="font-extrabold">ⓘ</span>
    </button>
  )
}
