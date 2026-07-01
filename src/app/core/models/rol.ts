export type AvailableRoles =
  | 'ROL_SUBGERENTE_ADMINISTRATIVO'
  | 'ROL_ANALISTA_DE_CONTRATOS'
  | 'SPINE_GESTOR_SUP'
  | 'SPINE_GESTOR_OP'
  | 'ROL_CAT_SEDI'
  | 'ROL_GEN_SOL_CONSULTA'
  | 'ROL_CREDITO_PF_PM'
  | 'ROL_ASESOR_FIN'
  | 'ROL_CAT_VIDEOLLAMADAS'
  | 'ROL_PLD'
  | 'ROL_ANALISTA_MIDDLE_OFFICE';

export interface RolesPermission<T> {
  ROL_SUBGERENTE_ADMINISTRATIVO: T;
  ROL_ANALISTA_DE_CONTRATOS: T;
  SPINE_GESTOR_SUP: T;
  SPINE_GESTOR_OP: T;
  ROL_CAT_SEDI: T;
  ROL_GEN_SOL_CONSULTA: T;
  ROL_CREDITO_PF_PM: T;
  ROL_ASESOR_FIN: T;
  ROL_CAT_VIDEOLLAMADAS: T;
  ROL_PLD: T;
  ROL_ANALISTA_MIDDLE_OFFICE: T;
}
export interface RolResponse {
  status: string;
  messages: string[];
  payload: EmployeesAdvisor;
}

export interface EmployeesAdvisor {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  areaId: number;
  statusId: number;
  userStatus: string;
  employeeId: string;
  employeePosition: string;
  branchId: any;
  admissionDate: string;
  userRoles: UserRoles[];
  userAttributes: UserAttribute[];
}

export interface UserAttribute {
  roleId: any;
  roleName: string;
  parentAttributeId: number;
  attributeId: any;
  attributeName: string;
  accessRole: any;
  url: any;
  positionId: number;
  icon: any;
  value: any;
}

export interface UserRoles {
  icon: string | null;
  parentAttribute: string | null;
  parentAttributeId: number | null;
  positionId: number | null;
  roleId: number | null;
  roleName: string | null;
  roleType: string | null;
  url: string | null;
  value: any;
}
