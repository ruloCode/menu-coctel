"use client"

interface ScrollingTextProps {
  text: string
  className?: string
}

export default function ScrollingText({ text, className = "" }: ScrollingTextProps) {
  // Repeat text multiple times to create seamless scroll effect
  const repeatedText = Array(10).fill(text).join(" ")

  return (
    <div className={`relative overflow-hidden whitespace-nowrap ${className}`}>
      <div className="inline-block animate-scroll-left">
        <span className="text-display font-black uppercase pr-8">
          {repeatedText}
        </span>
      </div>
    </div>
  )
}
