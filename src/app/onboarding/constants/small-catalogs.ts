import { EquityStrategyItem } from "../../maintenance/models/equity-stategy";
import { DefaultList } from "../../shared/models/default-list";

export const PERSON_TYPE: { key: string; value: string }[] = [
  { key: 'moral', value: 'Moral' },
  { key: 'fisica', value: 'Física' },
];

export const BENEFICIARY_ORIGIN = [
  { key: 'nacional', value: 'Nacional' },
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
];

// used in ACTIWEB
export const scPlanType: DefaultList<string>[] = [
  { key: '1', value: 'PLAN DE RETIRO 151' },
  { key: '2', value: 'PLAN DE RETIRO 185' },
];

// used in ACTIWEB
export const scCreditType: DefaultList<string>[] = [
  { key: '2', value: 'INTERMEDIARIO' },
  { key: '1', value: 'PRENDARIO' },
];

// used in ACTIWEB
export const scMinMarkClassification: DefaultList<string>[] = [
  { key: '6', value: 'ACCIONES DE MERCADO INTERMEDIO' },
  { key: '1', value: 'ALTA' },
  { key: '3', value: 'BAJA' },
  { key: '2', value: 'MEDIA' },
  { key: '4', value: 'MINIMA' },
  { key: '5', value: 'NULA' },
];

// used in ACTIWEB
export const scPortfolioCharge: DefaultList<boolean>[] = [
  { key: false, value: 'NO RETIENE IMPUESTO' },
  { key: true, value: 'SI RETIENE IMPUESTO' },
];

// used in ACTIWEB
export const scHighSpeedChannel: DefaultList<string>[] = [
  { key: '3', value: 'AMBOS' },
  { key: '1', value: 'BLOOMBERG' },
  { key: '2', value: 'ROX PERSONAL' },
];

// used in ACTIWEB
export const scPortfolioChargeType: DefaultList<string>[] = [
  { key: 'x', value: 'SIN COBRO DE ADMINISTRACIÓN' },
  { key: '2', value: 'DIARIO CON CARGO A FACTURA' },
  { key: '1', value: 'DIARIO CON CARGO AL CONTRATO' },
  { key: '4', value: 'MES CON CARGO A FACTURA' },
  { key: '3', value: 'MES CON CARGO AL CONTRATO' },
];

// used in ACTIWEB
export const scBankOrigin: DefaultList<string>[] = [
  { key: 'no', value: 'No' },
  { key: 'si', value: 'Si' },
];

// used in ACTIWEB
export const scAlphaPortfolioInvestment: DefaultList<string>[] = [
  { key: '1', value: '100% INSTRUMENTOS DE DEUDA' },
  { key: '2', value: 'CONSERVADOR' },
  { key: '3', value: 'PATRIMONIAL' },
  { key: '5', value: 'AGRESIVO' },
  { key: '6', value: 'DEUDA INTERNACIONAL' },
  { key: '4', value: 'CRECIMIENTO' },
];

// used in ACTIWEB
export const scInvestorKey: DefaultList<string>[] = [
  { key: '0', value: '0=NO DEFINIDO' },
  { key: '1', value: 'BÁSICO (1.5 MM UDIS)' },
  { key: '2', value: 'SOFISTICADO (3.0 MM UDIS)' },
  { key: '3', value: 'PARTICIPA EN OPI RESTRINGIDAS (>20 MM UDIS)' },
];
