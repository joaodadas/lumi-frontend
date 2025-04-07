// src/pages/Invoices.tsx
import { useEffect, useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import { getInvoicesByClient } from '@/services/invoiceService';
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const monthOrder = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
];

export default function Invoices() {
  const { clientNumber } = useClient();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      if (!clientNumber) return;
      try {
        const data = await getInvoicesByClient(clientNumber);
        const sorted = [...data].sort((a, b) => {
          const [mesA] = a.referenceMonth.split('-');
          const [mesB] = b.referenceMonth.split('-');
          return monthOrder.indexOf(mesA) - monthOrder.indexOf(mesB);
        });
        setInvoices(sorted);
      } catch (err) {
        console.error('Erro ao carregar faturas:', err);
      }
    };

    fetchData();
  }, [clientNumber]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Biblioteca de Faturas</h1>

      {/* Filtro por mês */}
      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="month" className="text-sm">
          Filtrar por mês:
        </label>
        <Select
          value={selectedMonth}
          onValueChange={(value) => setSelectedMonth(value)}
        >
          <SelectTrigger className="w-[180px] bg-neutral-800 border border-neutral-700 text-white">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 text-white border border-neutral-700">
            <SelectItem value="all">Todos</SelectItem>
            {monthOrder.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de faturas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4">Mês</th>
              <th className="py-3 px-4">Energia (kWh)</th>
              <th className="py-3 px-4">Valor s/ GD</th>
              <th className="py-3 px-4">Download</th>
            </tr>
          </thead>
          <tbody>
            {invoices
              .filter((invoice) =>
                selectedMonth !== 'all'
                  ? invoice.referenceMonth.startsWith(selectedMonth)
                  : true
              )
              .map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800 transition"
                >
                  <td className="py-3 px-4">{invoice.referenceMonth}</td>
                  <td className="py-3 px-4">{invoice.totalEnergyConsumption} kWh</td>
                  <td className="py-3 px-4">
                    R$ {invoice.totalValueWithoutGD.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={`${
                        import.meta.env.VITE_API_BASE_URL
                      }/invoices/download/${clientNumber}/${invoice.referenceMonth}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="icon">
                        <ArrowDownToLine className="w-4 h-4" />
                      </Button>
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
