import { RolesPermission } from "../models/rol";

export const MAINTENANCE_ACTIONS_ROLES: RolesPermission<MaintenanceActions> = {
    ROL_SUBGERENTE_ADMINISTRATIVO: {
        change_status     : true,
        replicate_contract: true,
        reprint_kit       : true,
    },
    ROL_ANALISTA_DE_CONTRATOS: {
        change_status     : true,
        replicate_contract: true,
        reprint_kit       : true,
    },
    SPINE_GESTOR_SUP: {
        change_status     : true,
        replicate_contract: true,
        reprint_kit       : false,
    },
    SPINE_GESTOR_OP: {
        change_status     : true,
        replicate_contract: true,
        reprint_kit       : false,
    },
    ROL_CAT_SEDI: {
        change_status     : true,
        replicate_contract: true,
        reprint_kit       : false,
    },
    ROL_GEN_SOL_CONSULTA: {
        change_status     : false,
        replicate_contract: false,
        reprint_kit       : false,
    },
    ROL_CREDITO_PF_PM: {
        change_status     : false,
        replicate_contract: false,
        reprint_kit       : false,
    },
    ROL_ASESOR_FIN: {
        change_status     : false,
        replicate_contract: false,
        reprint_kit       : true,
    },
    ROL_CAT_VIDEOLLAMADAS: {
        change_status     : true,
        replicate_contract: true,
        reprint_kit       : false,
    },
    ROL_PLD: {
        change_status     : false,
        replicate_contract: false,
        reprint_kit       : false,
    },
    ROL_ANALISTA_MIDDLE_OFFICE: {
        change_status     : false,
        replicate_contract: false,
        reprint_kit       : false,
    }
}

export type AvailableMaintenanceActions =
    'change-status'
    | 'replicate-contract'
    | 'reprint-kit';

export interface MaintenanceActions {
    change_status     : boolean;
    replicate_contract: boolean;
    reprint_kit       : boolean;
}