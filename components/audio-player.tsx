"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [expanded, setExpanded] = useState(false)
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const audio = new Audio("/background-music.mp3")
    audioRef.current = audio
    audio.loop = true
    audio.volume = volume

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration)
    })

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime)
    })

    // Intenta reproducir automáticamente
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          // Autoplay fue bloqueado
          console.log("Autoplay prevented:", error)
          setAutoplayFailed(true)
          setIsPlaying(false)
        })
    }

    return () => {
      cancelAnimationFrame(animationRef.current!)
      audio.pause()
      audio.src = ""
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        cancelAnimationFrame(animationRef.current!)
      } else {
        audioRef.current.play()
        animationRef.current = requestAnimationFrame(updateProgress)
      }
      setIsPlaying(!isPlaying)
      setAutoplayFailed(false)
    }
  }

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      animationRef.current = requestAnimationFrame(updateProgress)
    }
  }

  const onSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0)
    } else {
      setVolume(0.7)
    }
  }

  return (
    <>
     

      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-[#2a4bbd] border-t-4 border-[#f0d264] z-50"
        initial={{ y: expanded ? 0 : "calc(100% - 60px)" }}
        animate={{ y: expanded ? 0 : "calc(100% - 60px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className="h-14 flex items-center justify-between px-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-3 ${isPlaying ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
            ></div>
            <div className="bg-[#f0d264] text-[#2a4bbd] px-4 py-1 rounded-sm mr-4">
              <span className="text-sm font-black tracking-widest">ON AIR</span>
            </div>
            <span className="font-bold text-[#f0d264]">MOD RADIO</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full bg-[#f0d264] hover:bg-[#e5c85a] text-[#2a4bbd] p-0"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="p-6 bg-[#1a3bad] space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-center">
                <div className="text-[#f0d264] font-bold">
                  <h3 className="text-lg">FIESTA DE LANZAMIENTO</h3>
                  <p className="text-sm text-gray-300">2do Aniversario Luxury</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={toggleMute}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-[#2a4bbd] p-1 h-8 w-8 rounded-full"
                  >
                    {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <div className="w-24">
                    <Slider
                      value={[volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      className="h-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider value={[currentTime]} max={duration || 100} step={0.1} onValueChange={onSeek} className="h-1" />
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-12 w-12 rounded-full bg-[#2a4bbd] hover:bg-[#3a5bcd] text-white p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0
                    }
                  }}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePlay()
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-16 w-16 rounded-full bg-[#f0d264] hover:bg-[#e5c85a] text-[#2a4bbd] p-0"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-12 w-12 rounded-full bg-[#2a4bbd] hover:bg-[#3a5bcd] text-white p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0
                    }
                  }}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
