// src/components/InvoiceTable.tsx
import { useEffect, useState } from "react"
import { useClient } from "@/context/ClientContext"
import { getInvoiceHistory } from "@/services/invoiceService"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Invoice {
  referenceMonth: string
  totalEnergyConsumption: number
  totalValueWithoutGD: number
}

export function InvoiceTable() {
  const { clientNumber } = useClient()
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!clientNumber) return
      try {
        const data = await getInvoiceHistory(clientNumber)
        setInvoices(data)
      } catch (err) {
        console.error("Erro ao carregar histórico de faturas:", err)
      }
    }
    fetchInvoices()
  }, [clientNumber])

  const handleDownload = (month: string) => {
    if (!clientNumber) return
    const url = `http://localhost:3000/invoices/download/${clientNumber}/${month}`
    window.open(url, "_blank")
  }

  return (
    <Card className="bg-neutral-900 mt-8 p-6 rounded-2xl border border-neutral-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Faturas Recentes</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-neutral-300">
          <thead className="text-xs uppercase text-neutral-500 border-b border-neutral-800">
            <tr>
              <th scope="col" className="py-3 px-4">Mês</th>
              <th scope="col" className="py-3 px-4">Consumo (kWh)</th>
              <th scope="col" className="py-3 px-4">Valor (R$)</th>
              <th scope="col" className="py-3 px-4 text-right">PDF</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.referenceMonth}
                className="border-b border-neutral-800 hover:bg-neutral-800/50 transition"
              >
                <td className="py-3 px-4">{inv.referenceMonth}</td>
                <td className="py-3 px-4">{inv.totalEnergyConsumption} kWh</td>
                <td className="py-3 px-4">R$ {inv.totalValueWithoutGD.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(inv.referenceMonth)}
                    className="text-white border-white/20 hover:bg-neutral-700"
                  >
                    📄 Baixar PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
