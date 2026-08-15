interface VerifiedInfoSheetProps {
  onClose: () => void
}

export function VerifiedInfoSheet({ onClose }: VerifiedInfoSheetProps) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end bg-ink/55"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full flex-col gap-3 rounded-t-3xl bg-white px-5.5 pb-10 pt-6"
      >
        <div className="h-1.5 w-10 self-center rounded-full bg-sand-border" />
        <div className="flex items-center gap-2.5">
          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-verified-bg">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5B6B45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <span className="font-display text-[16.5px] font-bold leading-tight">O que é uma banca verificada?</span>
        </div>
        <p className="m-0 text-[13px] leading-relaxed text-muted">
          O Xique-Xique confirmou o documento do feirante e o ponto físico dele na feira. Não é
          garantia de qualidade da peça — é garantia de que essa banca existe e é quem diz ser.
        </p>
        <div className="mt-1.5 rounded-2xl bg-[#F6EFE6] p-3.5 text-[12.5px] leading-relaxed text-muted">
          Bancas sem o selo ainda podem vender normalmente — a verificação está em andamento com
          elas.
        </div>
      </div>
    </div>
  )
}
