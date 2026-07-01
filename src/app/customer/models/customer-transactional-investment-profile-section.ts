import { CustomerTransactionalResource } from "./customer-general-info-pm";


export interface CustomerInvestmentProfileData {
  investmentProfile: CustomerInvestmentProfile,
  investmentProfileQuiz: CustomerInvestmentProfileQuiz[];
  maintenanceQuiz: CustomerMaintenanceQuiz | null;
  transactionalProfile: any;
  transactionalResources: CustomerTransactionalResource[],
  investmentQuizId: number | null;
  profileRating: number | string | null;
  investmentQuizCompleted: boolean;
  onWorkFlow: boolean;
  practicaVentaId?: number | null;
}

export interface CustomerInvestmentProfile {
  service: string,
  subtype: string
}

export interface CustomerMaintenanceQuiz {
  sClient: boolean, //Cliente Sofisticado
  adendum: boolean, //Adendum
  mga: boolean, //Marco General de Actuación (MGA)
  awm: boolean, //Cobro de Comisiones Asset Wealth Management
  globalFront: boolean, //Global Front

  titular: string, //Nombre del Titular que Firma la Carta (CS)
  notApply: boolean, //No Aplica
  instClient: boolean, //Cliente Institucional
  noInstClient: boolean, //Cliente Institucional no quiere serlo
  instClientPub: boolean, //Cliente Institucional Entidad PUB/Emisora VAL
  instClientFid: boolean, //Cliente Institucional Fiduciario
}

export interface CustomerInvestmentProfileQuiz {
  idQuestion: string;
  idAnswer:   string;
}

export type InvestmentProfileData = CustomerInvestmentProfileData;
export type InvestmentProfile = CustomerInvestmentProfile;
export type MaintenanceQuiz = CustomerMaintenanceQuiz;
export type InvestmentProfileQuiz = CustomerInvestmentProfileQuiz;



