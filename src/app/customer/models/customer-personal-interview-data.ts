export interface CustomerPersonalInterviewForm {
  companyName: string;
  jobTitle: string;
  timeWorking: string;
  initialInvestmentInActinver: string;
  relationship: number;
  justificationInitialInvestment: boolean;
  productsOffered: string;
  inventory: boolean;
  date: string;
  interviewee: string;
  opening: string;
  interviewLocation: string;
  otherLocation: string;
  question1: boolean;
  question2: boolean;
  atypicalSituation: string;
  question3: boolean;
  atypicalSituationOther: string;
  residence: string;
  geographicalArea: string;
  homeVisit: false;
  matchingAddress: boolean;
  reason: string;
  locality: string;
  addressType: number;
  observationsHomeVisit: string;
  customerKnowledge: string;
  time: string;
  clientNumber: number;
  clientInvestmentAmount: string;
  initialInvestment: string;
  country: string;
  moreInformationClient: string;
  isPFWithBusinessActivity: boolean;
  lowRisk: {
    companyName: string;
    jobTitle: string;
    timeWorking: string;
  };
  mediumnRisk: {
    initialInvestmentInActinver: string;
    relationship: number;
    justificationInitialInvestment: boolean;
  };
  highRisk: {
    productsOffered: string;
    inventory: boolean;
  };
}

export interface CustomerDomicilioContrato {
  id: string;
  descripcion: string;
}

export interface CustomerApertura {
  description: string;
  aperturaId: string;
}

export const CustomerDOMICILIOS: CustomerDomicilioContrato[] = [
  { id: '1', descripcion: 'DOMICILIO DEL CONTRATO' },
  { id: '2', descripcion: 'LUGAR PUBLICO' },
  { id: '3', descripcion: 'CENTRO FINANCIERO' },
  { id: '4', descripcion: 'OTRO DOMICILIO' },
];

export const CustomerAPERTURA: CustomerApertura[] = [
  { description: 'PRESENCIAL', aperturaId: '1' },
  { description: 'DIGITAL', aperturaId: '2' },
];

export interface CustomerAtypicalSituation {
  id: string;
  descripcion: string;
}

export const ATYPICAL_SITUATION: CustomerAtypicalSituation[] = [
  {
    id: '1',
    descripcion:
      'PROPORCIONAN DATOS DE IDENTIFICACION QUE RESULTAN INEXISTENTES.',
  },
  {
    id: '2',
    descripcion:
      'MUESTRAN DISGUSTO O NERVIOSISMO AL APLICARLES LAS POLITICAS DE IDENTIFICACION Y CONOCIMIENTO DEL CLIENTE.',
  },
  {
    id: '3',
    descripcion: 'SE NIEGAN A PROPORCIONAR LA INFORMACION REQUERIDA.',
  },
  {
    id: '4',
    descripcion:
      'PRETENDEN SOBORNAR AL EMPLEADO CON LA FINALIDAD DE QUE ACEPTE INFORMACION INCOMPLETA Y/O PRESUNTAMENTE FALSA.',
  },
  { id: '5', descripcion: 'TRAEN POR ESCRITO SUS RESPUESTAS.' },
  { id: '6', descripcion: 'EVITAN EL CONTACTO DIRECTO CON EL PERSONAL.' },
  {
    id: '7',
    descripcion: 'TRATAN DE OCULTAR LA IDENTIDAD DEL PROPIETARIO CustomerREAL.',
  },
  {
    id: '8',
    descripcion:
      'SOLICITAN SER ATENDIDOS POR DETERMINADO EMPLEADO DE LA ENTIDAD SIN JUSTIFICACION APARENTE.',
  },
  {
    id: '9',
    descripcion:
      'LA ENTIDAD TIENE INFORMACION DE QUE EL CLIENTE O USUARIO PODRIA ESTAR INVOLUCRADO EN OPERACIONES FRAUDULENTAS O DELICTIVAS.',
  },
  {
    id: '10',
    descripcion:
      'NO DEMUESTRA CONOCIMIENTO DE SU ACTIVIDAD ECONOMICA DECLARADA.',
  },
  {
    id: '11',
    descripcion:
      'MUESTRA DESINTERES POR LOS BENEFICIOS O RENDIMIENTOS A OBTENER.',
  },
  {
    id: '12',
    descripcion:
      'CLIENTES QUE NO PUEDEN PRESENTARSE A UNA ENTREVISTA Y ADMINISTRAN SU CUENTA A TRAVES DE BANCA ELECTRONICA POR INTERNET O TECNOLOGIA SIMILAR.',
  },
  {
    id: '13',
    descripcion: 'CLIENTES ESTEN RELACIONADOS CON ACTIVIDADES DE RIESGO (PPE).',
  },
  {
    id: '14',
    descripcion:
      'CLIENTE SIN ACTIVIDAD ECONOMICA APARENTE, CON ALTA TRANSACCIONALIDAD.',
  },
  { id: '15', descripcion: 'PRESTANOMBRES.' },
  { id: '16', descripcion: 'OTRA.' },
];
export interface CustomerResidencia {
  id: string;
  descripcion: string;
}

export const CustomerRESIDENCIA: CustomerResidencia[] = [
  { id: '1', descripcion: 'MEXICO' },
  { id: '2', descripcion: 'EXTRANJERO' },
];

export interface CustomerGeographicalArea {
  id: string;
  descripcion: string;
}

export const GEOGRAPHICAL_AREA: CustomerGeographicalArea[] = [
  { id: '1', descripcion: 'CERCA DEL CENTRO FINANCIERO' },
  { id: '2', descripcion: 'EN OTRO ESTADO DE LA REPUBLICA' },
  { id: '3', descripcion: 'EN EL EXTRANJERO' },
];

export interface CustomerTipoPropiedad {
  id: string;
  descripcion: string;
}

export const ADDRESS_TYPE: CustomerTipoPropiedad[] = [
  { id: '1', descripcion: 'ES PROPIO' },
  { id: '2', descripcion: 'ES RENTADO' },
  {
    id: '3',
    descripcion:
      'OFICINA VIRTUAL, ESTA EN CONSTRUCCION REMODELACION O DESHABILITADO',
  },
  {
    id: '4',
    descripcion: 'NO APLICA – ENTREVISTA SOLO FUE POR MEDIOS DIGITALES',
  },
];

export interface CustomerConfirmacion {
  id: string;
  descripcion: string;
}

export const CustomerCONFIRMACION: CustomerConfirmacion[] = [
  { id: '1', descripcion: 'SI' },
  { id: '2', descripcion: 'NO' },
  { id: '3', descripcion: 'NO LOCALIZADO' },
];

export interface CustomerConocimientoCliente {
  id: string;
  descripcion: string;
}

export const CUSTOMER_KNOWLEDGE: CustomerConocimientoCliente[] = [
  { id: '1', descripcion: 'LO CONOZCO DE MUCHO TIEMPO' },
  { id: '2', descripcion: 'REFERIDO POR OTRO CLIENTE' },
  {
    id: '3',
    descripcion: 'NO LO CONOZCO. LLEGO POR SI SOLO AL CENTRO FINANCIERO',
  },
  { id: '4', descripcion: 'CustomerAPERTURA NO PRESENCIAL' },
];

export interface CustomerCoherenciaActividad {
  id: string;
  descripcion: string;
}

export const COHERENCIA_ACTIVIDAD: CustomerCoherenciaActividad[] = [
  { id: '1', descripcion: 'ACORDE A SU ACTIVIDAD Y AL NIVEL SOCIOECONOMICO' },
  { id: '2', descripcion: 'NO COINCIDE CON SU NIVEL SOCIOECONOMICO' },
  {
    id: '3',
    descripcion:
      'EL CLIENTE ACTUA POR CUENTA DE UN TERCERO O TIENE PROVEEDOR DE RECURSOS',
  },
  {
    id: '4',
    descripcion:
      'NO SE PUEDE DETERMINAR – ENTREVISTA SOLO FUE POR MEDIOS DIGITALES',
  },
];

export interface CustomerMedioPago {
  id: string;
  descripcion: string;
}

export const MEDIO_PAGO: CustomerMedioPago[] = [
  { id: '1', descripcion: 'DOCUMENTO' },
  { id: '2', descripcion: 'EFECTIVO Y/O CHEQUE DE VIAJERO' },
  { id: '3', descripcion: 'SPEI' },
  { id: '4', descripcion: 'MONEDAS ACUÑADAS' },
  { id: '5', descripcion: 'TRANSFERENCIAS INTERNACIONALES' },
];

export interface CustomerAntiguedadRelacion {
  id: string;
  descripcion: string;
}

export const ANTIGUEDAD_RELACION: CustomerAntiguedadRelacion[] = [
  { id: '1', descripcion: 'MENOS DE UN AÑO' },
  { id: '2', descripcion: 'ENTRE 1 A 5 AÑOS' },
  { id: '3', descripcion: 'ENTRE 5 A 10 AÑOS' },
  { id: '4', descripcion: 'MAS DE 10 AÑOS' },
];

export interface CustomerTipoCuenta {
  id: string;
  descripcion: string;
}

export const TIPO_CUENTA: CustomerTipoCuenta[] = [
  { id: '1', descripcion: 'OTRAS CUENTAS BANCARIAS A SU NOMBRE' },
  { id: '2', descripcion: 'CUENTAS BANCARIAS A NOMBRE DE TERCEROS' },
];

export interface CustomerRelacionCliente {
  id: string;
  descripcion: string;
}

export const RELACION_CLIENTE: CustomerRelacionCliente[] = [
  { id: '01', descripcion: 'CLIENTE' },
  { id: '02', descripcion: 'REPRESENTANTE LEGAL' },
  { id: '03', descripcion: 'APODERADO LEGAL' },
  { id: '04', descripcion: 'CONYUGE' },
  { id: '05', descripcion: 'BENEFICIARIO' },
  { id: '06', descripcion: 'ACREDITADO' },
  { id: '07', descripcion: 'PROPIETARIO CustomerREAL' },
  { id: '08', descripcion: 'PERSONA AUTORIZADA' },
  { id: '09', descripcion: 'PERSONA DE CONTROL' },
  { id: '10', descripcion: 'OBLIGADO SOLIDARIO' },
  { id: '11', descripcion: 'GARANTE' },
  { id: '12', descripcion: 'CONTRATANTE' },
  { id: '13', descripcion: 'ASEGURADO' },
];



export type PersonalInterviewForm = CustomerPersonalInterviewForm;
export type DomicilioContrato = CustomerDomicilioContrato;
export type Apertura = CustomerApertura;
export type AtypicalSituation = CustomerAtypicalSituation;
export type Residencia = CustomerResidencia;
export type GeographicalArea = CustomerGeographicalArea;
export type TipoPropiedad = CustomerTipoPropiedad;
export type Confirmacion = CustomerConfirmacion;
export type ConocimientoCliente = CustomerConocimientoCliente;
export type CoherenciaActividad = CustomerCoherenciaActividad;
export type MedioPago = CustomerMedioPago;
export type AntiguedadRelacion = CustomerAntiguedadRelacion;
export type TipoCuenta = CustomerTipoCuenta;
export type RelacionCliente = CustomerRelacionCliente;

