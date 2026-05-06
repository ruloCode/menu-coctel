import { cn } from "@/lib/utils"

interface DiagonalArrowProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export default function DiagonalArrow({
  className,
  size = 32,
  strokeWidth = 2,
}: DiagonalArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <polyline points="9,18 18,18 18,9" />
    </svg>
  )
}
