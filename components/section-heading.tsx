import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
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
