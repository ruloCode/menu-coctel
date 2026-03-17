import RegistrationForm from "@/components/registration-form"

export const metadata = {
  title: "Registro | MG Company Group",
  description: "Registrate para los eventos de MG Company Group.",
}

export default function RegistroPage() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <RegistrationForm />
      </div>
    </section>
  )
}
