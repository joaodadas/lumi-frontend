export interface DashboardTotals {
  totalEnergyConsumed: number;
  totalCompensatedEnergy: number;
  totalValueWithoutGD: number;
  totalGDSavings: number;
}

export interface MonthlyTotal {
  referenceMonth: string;
  totalEnergyConsumption: number;
  totalValueWithoutGD: number;
  gdSavings: number;
}
