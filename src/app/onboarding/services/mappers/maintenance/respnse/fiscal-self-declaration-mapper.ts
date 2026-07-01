import { convertDateBack } from '../../../../../shared/utils/datetime';
import {
  mapAutenticationTypeToDescSafe,
  mapPersonTypeToDescSafe,
  mapProffOfAddressTypeToDescSafe,
  normalizeBoolean,
} from '../../../../../shared/utils/maper-helpers.autocertification';
import { FiscalSelfDeclaration } from '../../../../models/checkpoints/fiscal-self-declaration-checkpoint';
import { DataFiscalSelfDeclaration } from '../../../../models/checkpoints/response/fiscal-self-declaration';

export function mapResToSignalFiscalSelfDeclarationM(
  input: DataFiscalSelfDeclaration,
): FiscalSelfDeclaration {
  return {
    id: (input as any).id,
    mexicoResident: normalizeBoolean(input.mexicoResident),
    curp: input.curp ?? '',
    foreignerWithoutCurp:
      (input as any).foreignerWithoutCurp ??
      (input as any).foreignWithoutCURP ??
      false,
    rfc: input.rfc ?? '',
    name: input.name ?? '',
    fiscalRegimeId: (input as any).fiscalRegimeId ?? '',
    cfdiUse: input.cfdiUse ?? '',
    taxPostalCode: input.taxPostalCode ?? '',
    nationality: input.nationality ?? '',
    country: input.country ?? '',
    fiscalResidenceAbroad: normalizeBoolean(input.fiscalResidenceAbroad),
    facta: normalizeBoolean(input.facta),
    crs: normalizeBoolean(input.crs),
    fiscalResidences:
      (input.fiscalResidences ?? []).map((residence: any) => ({
        personId: residence.personId,
        active: normalizeBoolean(residence.active),
        personType: mapPersonTypeToDescSafe(residence.personType),
        country: residence.country ?? '',
        declarationFiscalResidence: normalizeBoolean(
          residence.declarationFiscalResidence,
        ),
        proofOfAddressType: mapProffOfAddressTypeToDescSafe(
          residence.proofOfAddressType,
        ),
        issueDate: convertDateBack(residence.issueDate) ?? '',
        expirationStatus: residence.expirationStatus ?? '',
        expirationDate: convertDateBack(residence.expirationDate) ?? '',
        certificationDate: convertDateBack(residence.certificationDate) ?? '',
        declarationYear: Number(residence.declarationYear) || 0,
        aditionalDays: residence.aditionalDays ?? '',
        factaObligations: {
          factaId: residence.factaObligations?.factaId ?? null,
          autentication: mapAutenticationTypeToDescSafe(
            residence.factaObligations?.autentication,
          ),
          nif: residence.factaObligations?.nif ?? '',
          tin: residence.factaObligations?.tin ?? '',
          nss: residence.factaObligations?.nss ?? '',
        }
      })) ?? [],
  } as unknown as FiscalSelfDeclaration;
}
