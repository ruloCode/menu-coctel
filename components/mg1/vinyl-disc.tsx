import { cn } from "@/lib/utils"

export type DiscTier = "bronce" | "plata" | "oro" | "ruby"

interface TierStyle {
  highlight: string
  mid: string
  ring: string
  label: string
}

const TIERS: Record<DiscTier, TierStyle> = {
  bronce: { highlight: "#d99a52", mid: "#8a5a2b", ring: "#8a5a2b", label: "#d99a52" },
  plata: { highlight: "#dedede", mid: "#8f8f8f", ring: "#8f8f8f", label: "#dedede" },
  oro: { highlight: "#f0c84a", mid: "#b8860b", ring: "#b8860b", label: "#f0c84a" },
  ruby: { highlight: "#ff6b52", mid: "#E8200C", ring: "#E8200C", label: "#ff8a72" },
}

interface VinylDiscProps {
  tier: DiscTier
  spinDuration?: number
  className?: string
}

export default function VinylDisc({ tier, spinDuration = 13, className }: VinylDiscProps) {
  const t = TIERS[tier]
  const gradientId = `mg1-disc-${tier}`

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block w-full h-auto drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)]", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={t.highlight} />
          <stop offset="55%" stopColor={t.mid} />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>
      <g
        className="mg1-anim"
        style={{
          transformOrigin: "100px 100px",
          animation: `mg1-spin ${spinDuration}s linear infinite`,
        }}
      >
        <circle cx="100" cy="100" r="96" fill={`url(#${gradientId})`} />
        <circle cx="100" cy="100" r="78" fill="none" stroke="#00000055" strokeWidth="1.4" />
        <circle cx="100" cy="100" r="64" fill="none" stroke="#00000055" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="#00000055" strokeWidth="1" />
        <circle cx="100" cy="100" r="30" fill="#141414" />
        <circle cx="100" cy="100" r="29" fill="none" stroke={t.ring} strokeWidth="1.5" />
        <text
          x="100"
          y="100"
          textAnchor="middle"
          fontFamily="var(--font-bebas), sans-serif"
          fontSize="19"
          fill="#ffffff"
        >
          MG1
        </text>
        <text
          x="100"
          y="113"
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize="7"
          letterSpacing="1.5"
          fill={t.label}
        >
          {tier.toUpperCase()}
        </text>
        <circle cx="100" cy="100" r="3.5" fill="#000000" />
      </g>
    </svg>
  )
}
