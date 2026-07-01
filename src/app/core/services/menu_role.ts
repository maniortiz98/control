import { RolesPermission } from "../models/rol";

export const MENU_MATRIX: RolesPermission<PermissionMenuButton> = {
    ROL_SUBGERENTE_ADMINISTRATIVO: {
        addCustomer        : false,
        addPerson          : false,
        requestSearch      : true,
        customerSearch     : false,
        trust              : false,
        inbox              : true,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    },
    ROL_ANALISTA_DE_CONTRATOS: {
        addCustomer        : true,
        addPerson          : true,
        requestSearch      : true,
        customerSearch     : true,
        trust              : true,
        inbox              : true,
        portfolio_transfer : true,
        catalog_management : true,
        contract_management: true,
        catalogs           : true,
    },
    SPINE_GESTOR_SUP: {
        addCustomer        : true,
        addPerson          : true,
        requestSearch      : true,
        customerSearch     : true,
        trust              : true,
        inbox              : true,
        portfolio_transfer : true,
        catalog_management : true,
        contract_management: true,
        catalogs           : true,
    },
    SPINE_GESTOR_OP: {
        addCustomer        : false,
        addPerson          : false,
        requestSearch      : false,
        customerSearch     : false,
        trust              : false,
        inbox              : true,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    },
    ROL_CAT_SEDI: {
        addCustomer        : false,
        addPerson          : false,
        requestSearch      : false,
        customerSearch     : false,
        trust              : false,
        inbox              : true,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    },
    ROL_GEN_SOL_CONSULTA: {
        addCustomer        : false,
        addPerson          : false,
        requestSearch      : false,
        customerSearch     : false,
        trust              : false,
        inbox              : false,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    },
    ROL_CREDITO_PF_PM: {
        addCustomer        : false,
        addPerson          : false,
        requestSearch      : false,
        customerSearch     : false,
        trust              : false,
        inbox              : false,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    },
    ROL_ASESOR_FIN: {
        addCustomer        : true,
        addPerson          : true,
        requestSearch      : true,
        customerSearch     : true,
        trust              : false,
        inbox              : true,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    },
    ROL_CAT_VIDEOLLAMADAS: {
        addCustomer        : false,
        addPerson          : false,
        requestSearch      : false,
        customerSearch     : false,
        trust              : false,
        inbox              : true,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    },
    ROL_PLD: {
        addCustomer        : false,
        addPerson          : false,
        requestSearch      : false,
        customerSearch     : false,
        trust              : false,
        inbox              : true,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    },
    ROL_ANALISTA_MIDDLE_OFFICE: {
        addCustomer        : false,
        addPerson          : false,
        requestSearch      : false,
        customerSearch     : false,
        trust              : true,
        inbox              : true,
        portfolio_transfer : false,
        catalog_management : false,
        contract_management: true,
        catalogs           : false,
    }
}

export interface PermissionMenuButton {
  addCustomer        : boolean;
  addPerson          : boolean;
  requestSearch      : boolean;
  customerSearch     : boolean;
  trust              : boolean;
  inbox              : boolean;
  portfolio_transfer : boolean;
  catalog_management : boolean;
  contract_management: boolean;
  catalogs           : boolean;
};
