"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface FaqEntry {
  question: string
  answer: string
}

const FAQS: FaqEntry[] = [
  {
    question: "¿Trabajan con artistas independientes o solo con sellos?",
    answer:
      "Trabajamos con artistas independientes, sellos, marcas y managers. Lo que medimos es el proyecto, no el contrato.",
  },
  {
    question: "¿Cuánto cuesta producir con MG?",
    answer:
      "No tenemos tarifas fijas: cada proyecto tiene un alcance distinto. Después de una primera reunión te pasamos un presupuesto cerrado, sin sorpresas.",
  },
  {
    question: "¿Hacen distribución digital?",
    answer:
      "Sí. Distribuimos a Spotify, Apple Music, YouTube y plataformas afines como parte del paquete de MG Music. También gestionamos pitching editorial.",
  },
  {
    question: "¿Cuánto tarda producir un EP, videoclip o show?",
    answer:
      "Un single suele tomar 3 a 6 semanas, un EP 8 a 12, un videoclip 2 a 4 según locaciones. Tiempos reales, no promesas.",
  },
  {
    question: "¿Tienen contrato de exclusividad con los artistas?",
    answer:
      "Solo cuando el proyecto lo requiere y el artista lo pide. Preferimos relaciones largas que se sostengan por resultado, no por papel.",
  },
]

export default function FaqSection({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative bg-mg-black border-t border-white/10",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-16 md:py-24">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-14">
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <span className="font-mono text-mg-red text-[11px] md:text-xs uppercase tracking-[0.25em] font-medium whitespace-nowrap">
                [ 07 / FAQ ]
              </span>
              <span className="h-px flex-1 bg-mg-red/40" />
            </div>
            <h2 className="font-heading uppercase text-white leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)]">
              Preguntas frecuentes
            </h2>
          </div>
          <p className="col-span-12 md:col-span-5 text-zinc-400 text-sm md:text-base leading-relaxed md:pb-3">
            Lo que cualquier artista, sello o marca pregunta antes de
            mandarnos un mensaje.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="border-t border-white/10"
        >
          {FAQS.map((faq, i) => {
            const number = String(i + 1).padStart(2, "0")
            return (
              <AccordionItem
                key={faq.question}
                value={`item-${i}`}
                className="border-b border-white/10 group"
              >
                <AccordionTrigger className="py-6 md:py-8 hover:no-underline data-[state=open]:text-mg-red transition-colors">
                  <div className="flex items-baseline gap-4 md:gap-6 text-left">
                    <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-white/40 group-data-[state=open]:text-mg-red">
                      {number}
                    </span>
                    <span className="font-heading uppercase text-xl md:text-2xl lg:text-3xl tracking-tight leading-snug">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12 md:pl-16 pr-2 md:pr-12 pb-6 md:pb-8">
                  <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}
