import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useClient } from "@/context/ClientContext"
import { getInvoicesByClient } from "@/services/invoiceService"

export default function Login() {
  const [clientNumber, setClientNumber] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { setClientNumber: setClientInContext } = useClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!clientNumber.trim()) {
      setError("Por favor, insira um número de instalação válido.")
      return
    }

    setLoading(true)

    try {
      await getInvoicesByClient(clientNumber.trim())
      setClientInContext(clientNumber.trim())
      navigate("/dashboard")
    } catch (err) {
      setError("Número de instalação não encontrado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-neutral-800 shadow-md rounded-2xl p-8 w-full max-w-md space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-white">
          Consulta de Faturas
        </h1>

        <input
          type="text"
          placeholder="Número da Instalação"
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
          className="w-full px-4 py-2 rounded border border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-400"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-medium py-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>
    </main>
  )
}