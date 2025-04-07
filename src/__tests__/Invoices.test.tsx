// src/__tests__/Invoices.test.tsx

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Invoices from '@/pages/Invoices';
import { ClientProvider } from '@/context/ClientContext';

// Mock da URL da API
jest.mock('@/lib/config', () => ({
  API_BASE_URL: 'http://localhost:3000',
}));

// Mock da chamada da API de faturas
jest.mock('@/services/invoiceService', () => ({
  getInvoicesByClient: jest.fn().mockResolvedValue([
    {
      id: '1',
      referenceMonth: 'JAN-2024',
      totalEnergyConsumption: 150,
      totalValueWithoutGD: 320.5,
    },
  ]),
}));

describe('Invoices Page', () => {
  test('renderiza título e dados da fatura', async () => {
    // Simula clientNumber no localStorage (usado pelo contexto)
    localStorage.setItem('clientNumber', '1234567890');

    render(
      <BrowserRouter>
        <ClientProvider>
          <Invoices />
        </ClientProvider>
      </BrowserRouter>
    );

    expect(await screen.findByText('Biblioteca de Faturas')).toBeInTheDocument();
    expect(await screen.findByText('JAN-2024')).toBeInTheDocument();
    expect(await screen.findByText('150 kWh')).toBeInTheDocument();
    expect(await screen.findByText('R$ 320.50')).toBeInTheDocument();
  });
});
