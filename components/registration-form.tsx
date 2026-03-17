"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function RegistrationForm() {
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    correo: "",
    genero: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulando envío de datos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Resetear el formulario después de mostrar el mensaje de éxito
    setTimeout(() => {
      setIsSuccess(false)
      setFormData({
        nombre: "",
        celular: "",
        correo: "",
        genero: "",
      })
      setDate(undefined)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="relative z-30 w-full max-w-2xl mx-auto mb-40">
      {/* Fondo del formulario */}
      <div className="absolute inset-0 mt-16" style={{ zIndex: -1 }}>
        <Image 
          src="/fondo_principal.png"
          alt="Fondo Principal"
          layout="fill"
          objectFit="contain"
          className=" scale-125"
        />
      </div>
      
      <motion.div
        className=" relative"
        style={{ 
          maxWidth: "100%", 
          margin: "0 auto"
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className=" mx-auto   max-w-[300px]  ">
        

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <h3 className="text-2xl font-bold text-[#E8200C] mb-2">¡REGISTRO EXITOSO!</h3>
              <p className="text-[#E8200C]">Gracias por registrarte. ¡Te esperamos en nuestra fiesta!</p>
              <p className="text-xs mt-8 text-[#E8200C]">PRESENTA EL CÓDIGO QR QUE SERÁ ENVIADO A TU NÚMERO DE CONTACTO. ESTE CÓDIGO QR ES ÚNICO E INTRANSFERIBLE</p>
              <p className="text-xs mt-2 text-[#E8200C]">NOS RESERVAMOS EL DERECHO DE ADMICIÓN Y PERMANENCIA</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6  translate-y-[180px]">
              <div className="space-y-5">

                <div className="text-center">
                  <div className="bg-white text-black px-6 py-1 rounded-full inline-block mb-2">
                    <span className="text-lg md:text-xl font-black">¿CUAL ES TU NOMBRE?</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex justify-center">
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#E8200C] focus:border-[#E8200C] text-black max-w-[400px] mx-auto h-10 rounded-full"
                    />
                  </motion.div>
                </div>

                <div className="text-center">
                  <div className="bg-white text-black px-6 py-1 rounded-full inline-block mb-2">
                    <span className="text-lg md:text-xl font-black">¿DAME TU CELULAR?</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex justify-center">
                    <Input
                      id="celular"
                      name="celular"
                      type="tel"
                      value={formData.celular}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#E8200C] focus:border-[#E8200C] text-black max-w-[400px] mx-auto h-10 rounded-full"
                    />
                  </motion.div>
                </div>

                <div className="text-center">
                  <div className="bg-white text-black px-6 py-1 rounded-full inline-block mb-2">
                    <span className="text-lg md:text-xl font-black">¿TIENES E-MAIL?</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex justify-center">
                    <Input
                      id="correo"
                      name="correo"
                      type="email"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#E8200C] focus:border-[#E8200C] text-black max-w-[400px] mx-auto h-10 rounded-full"
                    />
                  </motion.div>
                </div>

                <div className="text-center">
                  <div className="bg-white text-black px-6 py-1 rounded-full inline-block mb-2">
                    <span className="text-lg md:text-xl font-black">¿TU GENERO?</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex justify-center">
                    <Input
                      id="genero"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      required
                      className="bg-white border-[#E8200C] focus:border-[#E8200C] text-black max-w-[400px] mx-auto h-10 rounded-full"
                    />
                  </motion.div>
                </div>

                <div className="text-center">
                  <div className="bg-white text-black px-6 py-1 rounded-full inline-block mb-2">
                    <span className="text-lg md:text-xl font-black">¿CUANDO CUMPLES AÑOS?</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex justify-center">
                    <Input
                      id="cumpleanos"
                      name="cumpleanos"
                      value={date ? format(date, "dd/MM/yyyy", { locale: es }) : ""}
                      className="bg-white border-[#E8200C] focus:border-[#E8200C] text-black max-w-[400px] mx-auto h-10 rounded-full"
                      onClick={() => document.getElementById('calendar-trigger')?.click()}
                      readOnly
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <button id="calendar-trigger" className="hidden">Abrir calendario</button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border-[#E8200C]">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          locale={es}
                          className="bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </motion.div>
                </div>
              </div>

              <div className="text-xs text-center text-[#000000] px-4 mt-6">
                <p>PRESENTA EL CÓDIGO QR QUE SERÁ ENVIADO A TU NÚMERO DE</p>
                <p>CONTACTO. ESTE CÓDIGO QR ES ÚNICO E INTRANSFERIBLE</p>
                <p className="mt-1">NOS RESERVAMOS EL DERECHO DE ADMICIÓN Y PERMANENCIA</p>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
