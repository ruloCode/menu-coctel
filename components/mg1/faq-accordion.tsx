"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface FaqItem {
  question: string
  answer: React.ReactNode
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="border-t border-white/10">
      {items.map((faq, i) => (
        <AccordionItem
          key={faq.question}
          value={`faq-${i}`}
          className="group border-b border-white/10"
        >
          <AccordionTrigger className="py-5 transition-colors hover:no-underline data-[state=open]:text-mg-red">
            <div className="flex items-baseline gap-4 text-left">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 group-data-[state=open]:text-mg-red">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-lg uppercase leading-snug tracking-tight md:text-xl">
                {faq.question}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-5 pl-11 pr-2">
            <p className="max-w-xl text-sm leading-relaxed text-zinc-300 md:text-[15px]">
              {faq.answer}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
