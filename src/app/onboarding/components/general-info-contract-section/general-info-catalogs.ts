export const REQUEST_STATUS: { id: string; description: string }[] = [
  { id: "0001", description: "NUEVA SOLICITUD" },
  { id: "0002", description: "LIQUID./MARCADO P.ARCHIVO" },
  { id: "0003", description: "LIQUIDACION DIRECTA" },
  { id: "0004", description: "REACT.CTA.- EN LIBERACION" },
  { id: "0010", description: "ACTIVO" },
  { id: "0012", description: "LIQUID.CTA.-EN LIBERACION" },
  { id: "0013", description: "LIQUIDACION CTA.PLANIFIC." },
  { id: "0014", description: "LIQUID.CTA.TRATAM.POST." },
  { id: "0020", description: "TRANS.CLIENTE INACT./CONT" },
  { id: "0021", description: "PROR.CONT.CLIENTE/SUSP." },

  { id: "A01", description: "DORMIDA" },
  { id: "A02", description: "BLOQUEADA" },
  { id: "A03", description: "INVERSION EN LIBERACION" },

  { id: "C01", description: "NUEVO" },
  { id: "C02", description: "CANCELADO" },
  { id: "C03", description: "CERRADO" },
  { id: "C04", description: "PRE APROBADO" },
  { id: "C05", description: "APROBADO" },
  { id: "C06", description: "BLOQUEADO" },
  { id: "C07", description: "REGISTRADO BURSANET" },
  { id: "C08", description: "POR ACTIVAR BURSANET" },
  { id: "C09", description: "POR ACTIVAR" },
  { id: "C10", description: "LIBERACION ADMINISTRATIVA" },
  { id: "C11", description: "LIBERACION CONTRATOS" },

  { id: "CC01", description: "NUEVO" },
  { id: "CC02", description: "CANCELADO" },
  { id: "CC03", description: "CERRADO" },
  { id: "CC04", description: "PRE APROBADO" },
  { id: "CC05", description: "APROBADO" },
  { id: "CC06", description: "BLOQUEADO" },
  { id: "CC07", description: "REGISTRADO BURSANET" },
  { id: "CC08", description: "POR ACTIVAR BURSANET" },
  { id: "CC09", description: "POR ACTIVAR" },
  { id: "CC10", description: "LIBERACION ADMINISTRATIVA" },
  { id: "CC11", description: "LIBERACION CONTRATOS" },

  { id: "I01", description: "INACTIVA" },
  { id: "I02", description: "CERRADA" },
  { id: "I03", description: "CANCELADA" },

  { id: "S01", description: "NUEVA" },
  { id: "S02", description: "RECHAZADA" },
  { id: "S03", description: "DEVUELTA" },
  { id: "S04", description: "CANCELADA" },
  { id: "S05", description: "PROCESADA" }
];

export const ACCOUNT_LEVEL: { id: string; description: string }[] = [
  { id: "01", description: "UNO" },
  { id: "02", description: "DOS" },
  { id: "03", description: "TRES" },
  { id: "04", description: "CUATRO" },
]

export const CONTRACT_MANAGEMENT: { id: string; description: string }[] = [
  { id: "1", description: "DISCRECIONAL" },
  { id: "2", description: "NO DISCRECIONAL" },
  { id: "3", description: "DISCRECIONAL LIMITADA" },
]

export const MANAGEMENT_TYPE: { id: string; description: string }[] = [
  { id: "01", description: "WEALTH MANAGEMENT" },
  { id: "02", description: "ASSET MANAGEMENT" },
  { id: "03", description: "RETAIL" },
  { id: "04", description: "ORIGEN CS" },
  { id: "05", description: "ESTRATEGIAS EQUITY" },
]

export const NOTIFICATION_TYPE: { id: string; description: string }[] = [
  { id: "01", description: "NO DEFINIDO" },
  { id: "02", description: "CORREO" },
  { id: "03", description: "CELULAR" },
  { id: "04", description: "CORREO Y CELULAR" },
]

export const ENROLLMENT_STATUS: {id: string; description: string }[] =[
  { id: "01", description: "CLIENTE NO ENROLADO" },
  { id: "02", description: "CLIENTE ENROLADO NO APROBADO" },
  { id: "03", description: "CLIENTE ENROLADO APROBADO" },
]

export const CLIENT_STATUS: { id: string; description: string }[] = [
  { id: "1", description: "NUEVO" },
  { id: "2", description: "DEVUELTO" },
  { id: "3", description: "RECHAZADO" },
  { id: "4", description: "ACTUALIZADO" },
  { id: "5", description: "APROBADO" },
]
//TODO operation reasons
