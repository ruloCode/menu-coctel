import { cn } from "@/lib/utils"

export interface SpecMetaItem {
  label: string
  value: string
}

interface SpecMetaProps {
  items: SpecMetaItem[]
  className?: string
  align?: "left" | "right"
  size?: "sm" | "xs"
}

export default function SpecMeta({
  items,
  className,
  align = "left",
  size = "xs",
}: SpecMetaProps) {
  const textSize = size === "sm" ? "text-sm" : "text-[11px]"

  return (
    <dl
      className={cn(
        "font-mono uppercase tracking-wider grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5",
        textSize,
        align === "right" && "text-right",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-white/70 font-medium">{item.label}</dt>
          <dd className="text-mg-red font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
