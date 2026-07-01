import { TransactionalResource } from "./general-info-pm";


export interface InvestmentProfileData {
  investmentProfile: InvestmentProfile,
  investmentProfileQuiz: InvestmentProfileQuiz[];
  maintenanceQuiz: MaintenanceQuiz | null;
  transactionalProfile: any;
  transactionalResources: TransactionalResource[],
  investmentQuizId: number | null;
  profileRating: number | string | null;
  investmentQuizCompleted: boolean;
  onWorkFlow: boolean;
  practicaVentaId?: number | null;
}

export interface InvestmentProfile {
  service: string,
  subtype: string
}

export interface MaintenanceQuiz {
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

export interface InvestmentProfileQuiz {
  idQuestion: string;
  idAnswer:   string;
}
