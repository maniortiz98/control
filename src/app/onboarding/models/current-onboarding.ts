import { Contract } from "../../maintenance/models/contracts";

export interface CurrentOnboardingInfo {
  requestId: string; // <-- el numero de onboarding actual
  personType: 'PF' | 'PM';
  name: string;
  contractType: string;
  contractSubtype: string;
  businessType: string;
  onboardingId: number;
  isMaintenance: boolean; // <<-- TRUE en Mantenimiento (2)
  isCustomer: boolean;
  isOnboarding: boolean; // <<-- TRUE en Onboarding (1)
  isOnboardingWL?: boolean;
  clientId: number;
  accountId: number;
  accountData: Contract | null; // <<-- Account/Contract Info used on Maintenance Mode
  // step: 'CUSTOMER' | 'CONTRACT' | 'MAINTENANCE' | 'ONBOARDING'
}





/*
"ALTA DE CLIENTE"
requestId: ''
personType: 'PF'
name: ''
contractType: '1'
contractSubtype: '2'
onboardingId: 0
isMaintenance: false
isCustomer: false


"MANTENIMIENTO | ADMIN DE CONTRATOS"
requestId: ''
personType: 'PF'
name: ''
contractType: '1'
contractSubtype: '2'
onboardingId: 0
isMaintenance: true
isCustomer: false
accountData: {} <-- la info del contrato/cuenta

"NUEVO ONBOARDING A CLIENTE EXISTENTE"
requestId: ''
personType: 'PF'
name: ''
contractType: '1'
contractSubtype: '2'
onboardingId: 0
isMaintenance: false
isCustomer: true

"CONTINUAR ONBOARDING"
requestId: ''
personType: 'PF'
name: ''
contractType: '1'
contractSubtype: '2'
onboardingId: 0
isMaintenance: false
isCustomer: false
isOnboarding : true

*/