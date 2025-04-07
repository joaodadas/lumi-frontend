import api from './api';
import { DashboardTotals, MonthlyTotal } from '@/types/dashboard';

export const getDashboardTotals = async (
  clientNumber: string
): Promise<DashboardTotals> => {
  const response = await api.get<DashboardTotals>(
    `/dashboard/totals/${clientNumber}`
  );
  return response.data;
};

export const getMonthlyTotals = async (
  clientNumber: string
): Promise<MonthlyTotal[]> => {
  const response = await api.get<MonthlyTotal[]>(
    `/dashboard/monthly/${clientNumber}`
  );
  return response.data;
};
