import { CustomerFiscalSelfDeclaration } from '../../../models/checkpoints/customer-fiscal-self-declaration-checkpoint';
import { DataFiscalSelfDeclaration } from '../../../models/checkpoints/response/customer-fiscal-self-declaration';
import { convertDateBack, convertDate } from '../../../utils/customer-datetime';
import {
  normalizeBoolean,
  mapPersonTypeToDescSafe,
  mapProffOfAddressTypeToDescSafe,
  mapAutenticationTypeToDescSafe,
} from '../../../utils/customer-maper-helpers-autocertification';

export function mapResToSignalFiscalSelfDeclaration(
  input: DataFiscalSelfDeclaration,
): CustomerFiscalSelfDeclaration {
  return {
    mexicoResident: normalizeBoolean(input.mexicoResident),
    curp: input.curp ?? '',
    foreignerWithoutCurp:
      (input as any).foreignerWithoutCurp ?? (input as any).foreignWithoutCURP ?? false,
    rfc: input.rfc ?? '',
    name: input.name ?? '',
    fiscalRegimeId: (input as any).fiscalRegimeId ?? 0,
    cfdiUse: input.cfdiUse ?? '',
    taxPostalCode: input.taxPostalCode ?? '',
    nationality: input.nationality ?? '',
    country: input.country ?? '',
    fiscalResidenceAbroad: normalizeBoolean(input.fiscalResidenceAbroad),
    facta: normalizeBoolean(input.facta),
    crs: normalizeBoolean(input.crs),
    fiscalResidences: (input.fiscalResidences ?? []).map((residence: any) => {
      const issue = convertDateBack(residence.issueDate);
      const expiration = convertDateBack(residence.expirationDate);
      const certification = convertDateBack(residence.certificationDate);
      return {
        personId: residence.personId,
        active: normalizeBoolean(residence.active),
        personType: mapPersonTypeToDescSafe(residence.personType),
        country: residence.country ?? '',
        declarationFiscalResidence: normalizeBoolean(residence.declarationFiscalResidence),
        proofOfAddressType: mapProffOfAddressTypeToDescSafe(residence.proofOfAddressType),
        issueDate: issue ? (convertDate(issue) as string) : '',
        expirationStatus: residence.expirationStatus ?? '',
        expirationDate: expiration ? (convertDate(expiration) as string) : '',
        certificationDate: certification ? (convertDate(certification) as string) : '',
        declarationYear: Number(residence.declarationYear) || 0,
        aditionalDays: residence.aditionalDays ?? '',
        factaObligations: {
          factaId: residence.factaObligations?.factaId ?? null,
          autentication: mapAutenticationTypeToDescSafe(residence.factaObligations?.autentication),
          nif: residence.factaObligations?.nif ?? '',
          tin: residence.factaObligations?.tin ?? '',
          nss: residence.factaObligations?.nss ?? '',
        },
      };
    }),
  };
}
