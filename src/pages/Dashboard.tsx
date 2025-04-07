import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine } from 'lucide-react';
import { useClient } from '@/context/ClientContext';
import {
  getDashboardTotals,
  getMonthlyTotals,
} from '@/services/dashboardService';
import { getInvoicesByClient } from '@/services/invoiceService';
import { DashboardTotals, MonthlyTotal } from '@/types/dashboard';
import { Invoice } from '@/types/invoice';
import { downloadInvoicePdf } from '@/utils/downloadInvoicePdf';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Dashboard() {
  const { clientNumber } = useClient();
  const [totals, setTotals] = useState<DashboardTotals | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyTotal[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const monthOrder = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!clientNumber) return;
      try {
        const [totalsRes, monthlyRes, invoiceRes] = await Promise.all([
          getDashboardTotals(clientNumber),
          getMonthlyTotals(clientNumber),
          getInvoicesByClient(clientNumber),
        ]);

        const sortedMonthly = [...monthlyRes].sort((a, b) => {
          const [mesA] = a.referenceMonth.split('-');
          const [mesB] = b.referenceMonth.split('-');
          return monthOrder.indexOf(mesA) - monthOrder.indexOf(mesB);
        });

        setTotals(totalsRes);
        setMonthlyData(sortedMonthly);
        setInvoices(invoiceRes);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      }
    };
    fetchData();
  }, [clientNumber]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow px-6 py-4">
          <CardHeader className="p-0">
            <CardTitle className="text-sm text-muted-foreground">
              Energia consumida
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-2xl font-bold tracking-tight">
              {totals ? `${totals.totalEnergyConsumed} kWh` : '--'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow px-6 py-4">
          <CardHeader className="p-0">
            <CardTitle className="text-sm text-muted-foreground">
              Compensada
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-2xl font-bold tracking-tight">
              {totals ? `${totals.totalCompensatedEnergy} kWh` : '--'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow px-6 py-4">
          <CardHeader className="p-0">
            <CardTitle className="text-sm text-muted-foreground">
              Valor sem GD
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-2xl font-bold tracking-tight">
              {totals ? `R$ ${totals.totalValueWithoutGD.toFixed(2)}` : '--'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow px-6 py-4">
          <CardHeader className="p-0">
            <CardTitle className="text-sm text-muted-foreground">
              Economia com GD
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-2xl font-bold tracking-tight">
              {totals ? `R$ ${totals.totalGDSavings.toFixed(2)}` : '--'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Consumo Mensal</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} barCategoryGap={20}>
            <XAxis
              dataKey="referenceMonth"
              stroke="#888"
              tick={{ fill: '#ccc', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#888"
              tick={{ fill: '#ccc', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ label, payload }) => {
                if (!payload || payload.length === 0) return null;
                const valor = Number(payload[0].value).toFixed(2);
                return (
                  <div className="rounded-md bg-neutral-800 px-3 py-2 shadow-lg border border-neutral-700">
                    <p className="text-sm text-white">{label}</p>
                    <p className="text-xs text-neutral-400">
                      Valor: R$ {valor}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="totalValueWithoutGD"
              fill="#ffffff"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filtro e tabela */}
      <div className="mt-10 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Faturas Recentes
        </h2>

        {/* Filtro por mês */}
        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="month" className="text-sm text-white">
            Filtrar por mês:
          </label>
          <Select
            onValueChange={(value) => setSelectedMonth(value)}
            value={selectedMonth ?? ''}
          >
            <SelectTrigger className="w-[180px] bg-neutral-800 border border-neutral-700 text-white">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 text-white border border-neutral-700">
              <SelectItem value="">Todos</SelectItem>
              {monthOrder.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
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
                  selectedMonth
                    ? invoice.referenceMonth.startsWith(selectedMonth)
                    : true
                )
                .map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800 transition"
                  >
                    <td className="py-3 px-4">{invoice.referenceMonth}</td>
                    <td className="py-3 px-4">
                      {invoice.totalEnergyConsumption} kWh
                    </td>
                    <td className="py-3 px-4">
                      R$ {invoice.totalValueWithoutGD.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`${
                          import.meta.env.VITE_API_BASE_URL
                        }/invoices/download/${clientNumber}/${
                          invoice.referenceMonth
                        }`}
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
      </div>
    </main>
  );
}
