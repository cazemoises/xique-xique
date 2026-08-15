interface PlaceholderPhotoProps {
  label?: string
  tone?: 'light' | 'dark'
  className?: string
  src?: string
}

export function PlaceholderPhoto({ label = 'foto', tone = 'light', className = '', src }: PlaceholderPhotoProps) {
  if (src) {
    return <img src={src} alt={label} className={`object-cover ${className}`} />
  }

  const stripes =
    tone === 'light'
      ? 'bg-[repeating-linear-gradient(135deg,#F0E0CC_0_7px,#E6D2B9_7px_14px)]'
      : 'bg-[repeating-linear-gradient(135deg,#E8D6BA_0_7px,#DBC194_7px_14px)]'

  return (
    <div className={`relative flex items-end justify-center overflow-hidden ${stripes} ${className}`}>
      <span className="mb-1.5 rounded bg-cream/90 px-1.5 py-0.5 font-mono text-[7.5px] text-[#8A6F52]">
        {label}
      </span>
    </div>
  )
}
