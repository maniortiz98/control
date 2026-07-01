import { FormGroup } from "@angular/forms";
import { butonFunctionDis, formFunctionDis } from "../../../shared/utils/disableOrEnabled";
import { ROLES } from "../../constants/const.role";

export function disableFormGroupWithExceptions(rol: string,
  formGroupGeneralData: FormGroup,
  formGroupPpe: FormGroup,
  formGroupAddress: FormGroup,
  exceptions: string[] = []): void {
  const buttonIds: string[] = ['btnSave','btnAddFam'];
  switch (rol) {
    case ROLES.ROL_ANALISTA_DE_CONTRATOS:
    case ROLES.SPINE_GESTOR_SUP:
      break;
    case ROLES.ROL_GEN_SOL_CONSULTA:
    case ROLES.ROL_SUBGERENTE_ADMINISTRATIVO:
    case ROLES.ROL_CRÉDITO_PF_PM:
      formFunctionDis(formGroupGeneralData);
      formFunctionDis(formGroupPpe);
      formFunctionDis(formGroupAddress);
      butonFunctionDis(buttonIds)
      break;
    default:
      break;
  }
}

export function disableFormGroupWithExceptionsPPE(rol: string,
  formGroupPpeModal: FormGroup,
  formGroupPpePositionModal: FormGroup,
  exceptions: string[] = []): void {
  const buttonIds: string[] = ['btnAddFamModal', ];
  switch (rol) {
    case ROLES.ROL_ANALISTA_DE_CONTRATOS:
    case ROLES.SPINE_GESTOR_SUP:
      break;
    case ROLES.ROL_GEN_SOL_CONSULTA:
    case ROLES.ROL_SUBGERENTE_ADMINISTRATIVO:
    case ROLES.ROL_CRÉDITO_PF_PM:
      formFunctionDis(formGroupPpeModal);
      formFunctionDis(formGroupPpePositionModal);
      butonFunctionDis(buttonIds)
      break;
    default:
      break;
  }
}