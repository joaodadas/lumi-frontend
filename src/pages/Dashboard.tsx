import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, Zap, Leaf, PiggyBank, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClient } from '@/hooks/useClient';
import {
  getDashboardTotals,
  getMonthlyTotals,
} from '@/services/dashboardService';
import { DashboardTotals, MonthlyTotal } from '@/types/dashboard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { clientNumber } = useClient();
  const [totals, setTotals] = useState<DashboardTotals | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyTotal[]>([]);
  const navigate = useNavigate();

  const monthOrder = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!clientNumber) return;
      try {
        const [totalsRes, monthlyRes] = await Promise.all([
          getDashboardTotals(clientNumber),
          getMonthlyTotals(clientNumber),
        ]);

        const sortedMonthly = [...monthlyRes].sort((a, b) => {
          const [mesA] = a.referenceMonth.split('-');
          const [mesB] = b.referenceMonth.split('-');
          return monthOrder.indexOf(mesA) - monthOrder.indexOf(mesB);
        });

        setTotals(totalsRes);
        setMonthlyData(sortedMonthly);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      }
    };
    fetchData();
  }, [clientNumber]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          variant="outline"
          className="border border-white text-black hover:bg-gray-200 hover:border-gray-200"
          onClick={() => navigate('/invoices')}
        >
          <FileText className="mr-2 h-4 w-4" /> Ver Faturas
        </Button>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow px-6 py-4 relative">
          <DollarSign className="absolute top-4 right-4 text-white" />
          <CardHeader className="p-0">
            <CardTitle className="text-sm text-white">
              Energia consumida
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-2xl font-bold tracking-tight text-white">
              {totals ? `${totals.totalEnergyConsumed} kWh` : '--'}
            </p>
            <p className="text-sm text-white">+5% este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow px-6 py-4 relative">
          <Zap className="absolute top-4 right-4 text-white" />
          <CardHeader className="p-0">
            <CardTitle className="text-sm text-white">Compensada</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-2xl font-bold tracking-tight text-white">
              {totals ? `${totals.totalCompensatedEnergy} kWh` : '--'}
            </p>
            <p className="text-sm text-white">+8% este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow px-6 py-4 relative">
          <Leaf className="absolute top-4 right-4 text-white" />
          <CardHeader className="p-0">
            <CardTitle className="text-sm text-white">Valor sem GD</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-2xl font-bold tracking-tight text-white">
              {totals ? `R$ ${totals.totalValueWithoutGD.toFixed(2)}` : '--'}
            </p>
            <p className="text-sm text-white">+4% este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow px-6 py-4 relative">
          <PiggyBank className="absolute top-4 right-4 text-white" />
          <CardHeader className="p-0">
            <CardTitle className="text-sm text-white">
              Economia com GD
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-2xl font-bold tracking-tight text-white">
              {totals ? `R$ ${totals.totalGDSavings.toFixed(2)}` : '--'}
            </p>
            <p className="text-sm text-white">+12% este mês</p>
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
    </main>
  );
}
