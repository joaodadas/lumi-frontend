import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import { ClientProvider } from '@/context/ClientContext';

// Mock das chamadas da API
jest.mock('@/services/dashboardService', () => ({
  getDashboardTotals: jest.fn().mockResolvedValue({
    totalEnergyConsumed: 1200,
    totalCompensatedEnergy: 800,
    totalValueWithoutGD: 300.5,
    totalGDSavings: 120.25,
  }),
  getMonthlyTotals: jest.fn().mockResolvedValue([]),
}));

describe('Dashboard Page', () => {
  test('renderiza títulos principais e botão de faturas', async () => {
    render(
      <BrowserRouter>
        <ClientProvider>
          <Dashboard />
        </ClientProvider>
      </BrowserRouter>
    );

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ver faturas/i })).toBeInTheDocument();
    expect(await screen.findByText(/energia consumida/i)).toBeInTheDocument();
    expect(await screen.findByText(/compensada/i)).toBeInTheDocument();
    expect(await screen.findByText(/valor sem gd/i)).toBeInTheDocument();
    expect(await screen.findByText(/economia com gd/i)).toBeInTheDocument();
  });
});
