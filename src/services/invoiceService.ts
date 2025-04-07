import api from './api';

export const getInvoicesByClient = async (clientNumber: string) => {
  const response = await api.get(`/invoices/history/${clientNumber}`);
  return response.data;
};

export const getInvoiceHistory = async (clientNumber: string) => {
  const response = await api.get(`/invoices/history/${clientNumber}`);
  return response.data;
};
