
import { EquityStrategyItem } from '../models/customer-equity-stategy';

export const PERSON_TYPE: {key: string; value: string}[] = [
  { key: 'moral',  value: 'Moral'  },
  { key: 'fisica', value: 'Física' },
];

export const BENEFICIARY_ORIGIN = [
  { key: 'nacional',   value: 'Nacional'   },
  { key: 'extranjero', value: 'Extranjero' },
];

export const SIGN_CLASS_CATALOG = [
  { key: 'A', value: 'A' },
  { key: 'B', value: 'B' },
  { key: 'C', value: 'C' }
];

export const mockStrategy: EquityStrategyItem[] = [
    {
      idStrategy: 1,
      cveStrategy: "SMART-WARRANTS",
      description: "SMART WARRANTS MOCK",
      active: true,
      minimumAmount: 100000.00,
    },
    {
      idStrategy: 2,
      cveStrategy: "SMART-PICKS",
      description: "SMART PICKS MOCK",
      active: true,
      minimumAmount: 100000.00,
    },
    {
      idStrategy: 3,
      cveStrategy: "MOCK-3",
      description: "ITEM MOCK 3",
      active: true,
      minimumAmount: 100000.00,
    },
    {
      idStrategy: 4,
      cveStrategy: "MOCK-4",
      description: "ITEM MOCK 4",
      active: true,
      minimumAmount: 100000.00,
    },
    {
      idStrategy: 5,
      cveStrategy: "MOCK-5",
      description: "ITEM MOCK 5",
      active: true,
      minimumAmount: 100000.00,
    },
  ]
