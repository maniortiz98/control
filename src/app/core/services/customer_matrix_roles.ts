import { RolesPermission } from "../models/rol";
import { CUSTOMER_ROL_ANALISTA_DE_CONTRATOS } from "./customer_roles_matrix/customer-analista-contratos";
import { CUSTOMER_ROL_ANALISTA_MIDDLE_OFFICE } from "./customer_roles_matrix/customer-analista-middle-office";
import { CUSTOMER_ROL_ASESOR_FIN } from "./customer_roles_matrix/customer-asesor-fin";
import { CUSTOMER_ROL_CAT_SEDI } from "./customer_roles_matrix/customer-cat-sedi";
import { CUSTOMER_ROL_CAT_VIDEOLLAMADAS } from "./customer_roles_matrix/customer-cat-videollamadas";
import { CUSTOMER_ROL_CREDITO_PF_PM } from "./customer_roles_matrix/customer-credito-pf-pm";
import { CUSTOMER_ROL_GEN_SOL_CONSULTA } from "./customer_roles_matrix/customer-gen-sol-consulta";
import { CUSTOMER_ROL_PLD } from "./customer_roles_matrix/customer-pld";
import { CUSTOMER_SPINE_GESTOR_OP } from "./customer_roles_matrix/customer-spine-gestor-op";
import { CUSTOMER_SPINE_GESTOR_SUP } from "./customer_roles_matrix/customer-spine-gestor-sup";
import { CUSTOMER_ROL_SUBGERENTE_ADMINISTRATIVO } from "./customer_roles_matrix/customer-subgerente-administrativo";

export const CUSTOMER_PERMISSIONS_MATRIX: RolesPermission<View> = {
  'ROL_SUBGERENTE_ADMINISTRATIVO': CUSTOMER_ROL_SUBGERENTE_ADMINISTRATIVO,
  'ROL_ANALISTA_DE_CONTRATOS': CUSTOMER_ROL_ANALISTA_DE_CONTRATOS,
  'SPINE_GESTOR_SUP': CUSTOMER_SPINE_GESTOR_SUP,
  'SPINE_GESTOR_OP': CUSTOMER_SPINE_GESTOR_OP,
  'ROL_CAT_SEDI': CUSTOMER_ROL_CAT_SEDI,
  'ROL_GEN_SOL_CONSULTA': CUSTOMER_ROL_GEN_SOL_CONSULTA,
  'ROL_CREDITO_PF_PM': CUSTOMER_ROL_CREDITO_PF_PM,
  'ROL_ASESOR_FIN': CUSTOMER_ROL_ASESOR_FIN,
  'ROL_CAT_VIDEOLLAMADAS': CUSTOMER_ROL_CAT_VIDEOLLAMADAS,
  'ROL_ANALISTA_MIDDLE_OFFICE': CUSTOMER_ROL_ANALISTA_MIDDLE_OFFICE,
  'ROL_PLD': CUSTOMER_ROL_PLD,
};

interface View {
  'address': RolePermises;
  'contact-info': RolePermises;
  'customer-info': RolePermises;
  'general-info': RolePermises;
  'ppe-info': RolePermises;
  'tax-info': RolePermises;
};

export interface RolePermises {
  hide?: boolean;
  allDisabled: boolean;
  buttonsDisabled?: string[];

  add?: boolean;
  edit?: boolean;
  delete?: boolean;
  permission?: string[];
  fieldsDisabled?: string[];
  fieldsEnabled?: string[];
  buttonsEnabled?: string[];
  sections?: any;
}
