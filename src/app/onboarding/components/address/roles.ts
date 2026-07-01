import { FormGroup } from "@angular/forms";
import { butonFunctionDis, formFunctionDis } from "../../../shared/utils/disableOrEnabled";
import { ROLES } from "../../constants/const.role";

export function disableFormGroupWithExceptions(rol: string,
  addresForm: FormGroup,
  exceptions: string[] = []): void {
  const buttonIds: string[] = ['btnSaveAddress', 'btnAddFamModal', 'btnAddAddress'];
  switch (rol) {
    case ROLES.ROL_ANALISTA_DE_CONTRATOS:
    case ROLES.SPINE_GESTOR_SUP:
      break;
    case ROLES.SPINE_GESTOR_OP:
    case ROLES.ROL_GEN_SOL_CONSULTA:
    case ROLES.ROL_CRÉDITO_PF_PM:
    case ROLES.ROL_SUBGERENTE_ADMINISTRATIVO:
      formFunctionDis(addresForm);
      butonFunctionDis(buttonIds);
      break;
    case ROLES.ROL_CAT_SEDI:
    case ROLES.ROL_CAT_VIDEOLLAMADAS:
      break;
    default:
      break;
  }
}
