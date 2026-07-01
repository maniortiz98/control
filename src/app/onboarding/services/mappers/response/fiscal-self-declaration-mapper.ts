import { mapPersonTypeToDescSafe, mapProffOfAddressTypeIdQuick, mapProffOfAddressTypeToDescSafe, normalizeBoolean } from '../../../../shared/utils/maper-helpers.autocertification';
import { FiscalSelfDeclaration } from '../../../models/checkpoints/fiscal-self-declaration-checkpoint';
import { DataFiscalSelfDeclaration } from '../../../models/checkpoints/response/fiscal-self-declaration';

export function mapResToSignalFiscalSelfDeclaration(
  input: DataFiscalSelfDeclaration,
): FiscalSelfDeclaration {
  return {
    mexicoResident: input.mexicoResident ?? false,
    curp: input.curp ?? '',
    foreignerWithoutCurp: input.foreignerWithoutCurp ?? false,
    rfc: input.rfc ?? '',
    name: input.name ?? '',
    fiscalRegimeId: input.fiscalRegimeId ?? 0,
    cfdiUse: input.cfdiUse ?? '',
    taxPostalCode: input.taxPostalCode ?? '',
    nationality: input.nationality ?? '',
    country: input.country ?? '',
    fiscalResidenceAbroad: input.fiscalResidenceAbroad ?? false,
    facta: input.facta ?? false,
    crs: input.crs ?? false,
    fiscalResidences:
    (input.fiscalResidences ?? []).map((residence: any) => ({
        personType: mapPersonTypeToDescSafe(residence.personType) ,
        country: residence.country ?? '',
        declarationFiscalResidence: normalizeBoolean(
          residence.declarationFiscalResidence),
        proofOfAddressType: mapProffOfAddressTypeToDescSafe(residence.proofOfAddressType ?? ''),
        issueDate: residence.issueDate ?? '',
        expirationStatus: residence.expirationStatus ?? '',
        expirationDate: residence.expirationDate ?? '',
        certificationDate: residence.certificationDate ?? '',
        declarationYear: residence.declarationYear ?? 0,
        aditionalDays: residence.aditionalDays ?? '',
        factaObligations: {
          autentication: residence.factaObligations?.autentication ?? '',
          nif: residence.factaObligations?.nif ?? '',
          tin: residence.factaObligations?.tin ?? '',
          nss: residence.factaObligations?.nss ?? '',
        },
      })) ?? [],
  }as unknown as FiscalSelfDeclaration;
}
