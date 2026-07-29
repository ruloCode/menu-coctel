import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: React.ReactNode
  index?: string
  kicker?: string
  className?: string
}

export default function SectionHeading({
  title,
  subtitle,
  index,
  kicker,
  className,
}: SectionHeadingProps) {
  if (!index && !kicker) {
    return (
      <div className={cn("flex flex-col items-center text-center", className)}>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-wide text-white">
          {title}
        </h2>
        <div className="w-16 h-1 bg-mg-red mt-4" />
        {subtitle && (
          <p className="mt-4 text-zinc-400 text-base md:text-lg max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-3 mb-4 md:mb-5">
        <span className="font-mono text-mg-red text-[11px] md:text-xs uppercase tracking-[0.25em] font-medium whitespace-nowrap">
          [ {index ?? "00"} / {kicker ?? "MG"} ]
        </span>
        <span className="h-px flex-1 bg-mg-red/40" />
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
        <h2 className="col-span-12 md:col-span-7 font-heading uppercase text-white leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
          {title}
        </h2>
        {subtitle && (
          <p className="col-span-12 md:col-span-5 text-zinc-400 text-sm md:text-base leading-relaxed font-body md:pb-3">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
