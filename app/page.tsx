import RegistrationForm from "@/components/registration-form"
import AudioPlayer from "@/components/audio-player"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#2a4bbd] text-white overflow-hidden relative">
      <div className="max-w-[1109px] mx-auto overflow-hidden relative">
        
        {/* Logo ODS PARTY en ambos lados */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
          <Image src="/logo_ods.png" alt="ODS PARTY" width={100} height={40} className="md:w-[150px] md:h-[60px]" />
        </div>
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
          <Image src="/logo_ods.png" alt="ODS PARTY" width={100} height={40} className="md:w-[150px] md:h-[60px]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-4xl">
            <header className="mb-6 text-center m-auto flex flex-col items-center justify-center">
            
              
              {/* Logo MOD */}
              <div className="relative mb-4 m-auto">
                <Image 
                  src="/titulo.png" 
                  alt="MOD" 
                  width={300}
                  height={125}
                  className="max-w-[300px] md:max-w-[600px]"
                />
              </div>
              
            
            </header>
            
            {/* Imagen de fecha - visible en móvil */}
            {/* <div className="block md:hidden mx-auto text-center mb-4">
              <Image 
                src="/fecha.png" 
                alt="SÁBADO JUN 14 8:00 PM" 
                width={150} 
                height={180} 
                className="mx-auto"
              />
            </div> */}
            
            {/* Imagen de fecha - visible en desktop */}
            {/* <div className="absolute right-5 md:right-10 top-1/3 z-20 hidden md:block">
              <Image 
                src="/fecha.png" 
                alt="SÁBADO JUN 14 8:00 PM" 
                width={200} 
                height={250} 
              />
            </div> */}
            
           

            <RegistrationForm />
            
          
          </div>
        </div>
      </div>
      
      <AudioPlayer />
    </main>
  )
}
