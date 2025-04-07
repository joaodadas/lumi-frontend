// src/services/invoiceService.ts
import api from './api';
import { Invoice } from '@/types/invoice';

export const getInvoicesByClient = async (
  clientNumber: string
): Promise<Invoice[]> => {
  const response = await api.get<Invoice[]>(
    `/invoices/history/${clientNumber}`
  );
  return response.data;
};

export const getInvoiceHistory = getInvoicesByClient; // reaproveitando a função
