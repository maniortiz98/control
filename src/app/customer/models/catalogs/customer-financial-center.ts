export interface CustomerFinancialCenter {
  financialCenterCode: string;
  financialCenter:     string;
  active:              boolean;
  created:             string;
  modified:            string;
}

export type FinancialCenter = CustomerFinancialCenter;

