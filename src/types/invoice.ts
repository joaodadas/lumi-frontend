// src/types/invoice.ts

export interface Invoice {
  id: string;
  referenceMonth: string;
  totalEnergyConsumption: number;
  totalValueWithoutGD: number;
}
