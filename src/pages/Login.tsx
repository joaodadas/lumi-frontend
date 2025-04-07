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

      // Armazena e atualiza contexto
      setClientInContext(clientNumber.trim())

      // Redireciona
      navigate("/dashboard")
    } catch (err) {
      setError("Número de instalação não encontrado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Consulta de Faturas
        </h1>

        <input
          type="text"
          placeholder="Número da Instalação"
          value={clientNumber}
          onChange={(e) => setClientNumber(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
        />

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>
    </main>
  )
}
