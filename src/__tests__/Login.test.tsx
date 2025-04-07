/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import { ClientProvider } from '@/context/ClientContext';

jest.mock('@/services/invoiceService', () => ({
  getInvoicesByClient: jest.fn().mockResolvedValue([]),
}));

describe('Login Page', () => {
  test('renderiza input e botão', () => {
    render(
      <BrowserRouter>
        <ClientProvider>
          <Login />
        </ClientProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Número da Instalação')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /consultar/i })).toBeInTheDocument();
  });

  test('mostra erro se tentar logar com input vazio', () => {
    render(
      <BrowserRouter>
        <ClientProvider>
          <Login />
        </ClientProvider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /consultar/i }));
    expect(screen.getByText(/por favor, insira um número/i)).toBeInTheDocument();
  });
});
