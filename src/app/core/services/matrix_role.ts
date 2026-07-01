import { RolesPermission } from "../models/rol";
import { ROL_ANALISTA_DE_CONTRATOS } from "./roles_matrix/analista-contratos";
import { ROL_ANALISTA_MIDDLE_OFFICE } from "./roles_matrix/analista-middle-office";
import { ROL_ASESOR_FIN } from "./roles_matrix/asesor-fin";
import { ROL_CAT_SEDI } from "./roles_matrix/cat-sedi";
import { ROL_CAT_VIDEOLLAMADAS } from "./roles_matrix/cat-videollamadas";
import { ROL_CREDITO_PF_PM } from "./roles_matrix/credito-pf-pm";
import { ROL_GEN_SOL_CONSULTA } from "./roles_matrix/gen-sol-consulta";
import { ROL_PLD } from "./roles_matrix/pld";
import { SPINE_GESTOR_OP } from "./roles_matrix/spine-gestor-op";
import { SPINE_GESTOR_SUP } from "./roles_matrix/spine-gestor-sup";
import { ROL_SUBGERENTE_ADMINISTRATIVO } from "./roles_matrix/subgerente-administrativo";

export const PERMISSIONS_MATRIX: RolesPermission<View> = {
  'ROL_SUBGERENTE_ADMINISTRATIVO': ROL_SUBGERENTE_ADMINISTRATIVO,
  'ROL_ANALISTA_DE_CONTRATOS': ROL_ANALISTA_DE_CONTRATOS,
  'SPINE_GESTOR_SUP': SPINE_GESTOR_SUP,
  'SPINE_GESTOR_OP': SPINE_GESTOR_OP,
  'ROL_CAT_SEDI': ROL_CAT_SEDI,
  'ROL_GEN_SOL_CONSULTA': ROL_GEN_SOL_CONSULTA,
  'ROL_CREDITO_PF_PM': ROL_CREDITO_PF_PM,
  'ROL_ASESOR_FIN': ROL_ASESOR_FIN,
  'ROL_CAT_VIDEOLLAMADAS': ROL_CAT_VIDEOLLAMADAS,
  'ROL_ANALISTA_MIDDLE_OFFICE': ROL_ANALISTA_MIDDLE_OFFICE,
  'ROL_PLD': ROL_PLD,
};

interface View {
  address: RolePermises;
  'authorized-person': RolePermises;
  'authorized-person-pm': RolePermises;
  'bank-account': RolePermises;
  'bank-account-pm': RolePermises;
  beneficiaries: RolePermises;
  'beneficiaries-pm'?: RolePermises;
  'contact-info': RolePermises;
  'contact-info-pm': RolePermises;
  'customer-info': RolePermises;
  directorate: RolePermises;
  'general-info': RolePermises;
  'general-info-pm': RolePermises;
  'operate-changes': RolePermises;
  'pld-quiz': RolePermises;
  'ppe-info': RolePermises;
  'privacy-notice': RolePermises;
  'real-owner': RolePermises;
  'resource-provider': RolePermises;
  sign: RolePermises;
  'spid-profile': RolePermises;
  spouse: RolePermises;
  'transactional-investment-profile': RolePermises;
  'sales-practices': RolePermises;
  'actiweb': RolePermises;
  'customer-info-pm': RolePermises;
  'address-pm': RolePermises;
  'pld-quiz-pm': RolePermises;
  'sign-pm': RolePermises;
  'operate-changes-pm': RolePermises;
  'organization-chart': RolePermises;
  'entity-status': RolePermises;
  'resource-provider-pm': RolePermises;
  'administrator-exercising-pf-control': RolePermises;
  'interview': RolePermises;
  'tax-info': RolePermises;
  'credit-data': RolePermises;
  'additional-info': RolePermises;
  'tax-profile': RolePermises;
};

export interface RolePermises {
  hide: boolean;
  allDisabled: boolean;
  buttonsDisabled: string[];

  add?: boolean;
  edit?: boolean;
  delete?: boolean;
  permission?: string[];
  fieldsDisabled?: string[];
  fieldsEnabled?: string[];
  buttonsEnabled?: string[];
  sections?: any;
}
