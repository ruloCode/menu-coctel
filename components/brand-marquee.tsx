import { cn } from "@/lib/utils"

interface BrandMarqueeProps {
  items?: string[]
  className?: string
  variant?: "red" | "outline"
}

const DEFAULT_ITEMS = [
  "ARTISTIC GROWTH COMPANY",
  "MIND OF GODS",
  "MG MUSIC",
  "MG FILM",
  "MG UP",
  "MG LIVE",
]

export default function BrandMarquee({
  items = DEFAULT_ITEMS,
  className,
  variant = "red",
}: BrandMarqueeProps) {
  const sequence = [...items, ...items, ...items, ...items]

  const containerClasses =
    variant === "red"
      ? "bg-mg-red text-white border-y border-black/30"
      : "bg-mg-black text-white border-y border-white/15"

  const separatorColor = variant === "red" ? "text-white/60" : "text-mg-red"

  return (
    <div
      className={cn(
        "relative overflow-hidden select-none",
        containerClasses,
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex animate-scroll-left whitespace-nowrap py-3 md:py-4">
        {sequence.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-6 md:gap-10 px-6 md:px-10 font-mono uppercase text-sm md:text-base tracking-[0.25em] font-medium"
          >
            <span>{item}</span>
            <span className={cn("text-lg md:text-xl", separatorColor)}>
              &#10022;
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
