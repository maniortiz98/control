import { CustomerFiscalSelfDeclaration } from "../../../../models/checkpoints/customer-fiscal-self-declaration-checkpoint";
import { normalizeBoolean, mapPersonType, mapProffOfAddressTypeIdQuick, toDDMMYYYY, mapAutenticationTypeIdQuick } from "../../../../utils/customer-maper-helpers-autocertification";

export function mapToCheckPointFiscalSelfDeclarationDataM(
  form: CustomerFiscalSelfDeclaration,
): CustomerFiscalSelfDeclaration {
  const {
    mexicoResident,
    curp,
    foreignerWithoutCurp,
    rfc,
    name,
    fiscalRegimeId,
    cfdiUse,
    taxPostalCode,
    nationality,
    country,
    fiscalResidenceAbroad,
    facta,
    crs,
    fiscalResidences,
  } = form;

  const hasActiveResidence = fiscalResidences.some(
    (residence: any) => residence.declarationFiscalResidence,
  );

  if (!hasActiveResidence) {
    throw new Error('No active fiscal residence found.');
  }

  return {
    id: (form as any).id,
    mexicoResident: normalizeBoolean(mexicoResident),
    curp: curp ?? '',
    foreignerWithoutCurp: foreignerWithoutCurp ?? false,
    rfc: rfc ?? '',
    name: name ?? '',
    fiscalRegimeId: fiscalRegimeId,
    cfdiUse: cfdiUse ?? '',
    taxPostalCode: taxPostalCode ?? '',
    nationality: nationality ?? '',
    country: country ?? '',
    fiscalResidenceAbroad: normalizeBoolean(fiscalResidenceAbroad),
    facta: normalizeBoolean(facta),
    crs: normalizeBoolean(crs),
    fiscalResidences: fiscalResidences.map((residence: any) => ({
      personId: residence.personId,
      active: normalizeBoolean(residence.active),
      personType: mapPersonType(String(residence.personType ?? '')),
      country: residence.country ?? '',
      declarationFiscalResidence: normalizeBoolean(residence.declarationFiscalResidence),
      proofOfAddressType: mapProffOfAddressTypeIdQuick(residence.proofOfAddressType ?? ''),
      issueDate: toDDMMYYYY(residence.issueDate) ?? '',
      expirationStatus: residence.expirationStatus ?? '',
      expirationDate: toDDMMYYYY(residence.expirationDate) ?? '',
      certificationDate: toDDMMYYYY(residence.certificationDate) ?? '',
      declarationYear: Number(residence.declarationYear),
      aditionalDays: residence.aditionalDays ?? '',
      factaObligations: {
        factaId: residence.factaObligations?.factaId ?? null,
        autentication: mapAutenticationTypeIdQuick(residence.factaObligations?.autentication ?? ''),
        nif: residence.factaObligations?.nif ?? '',
        tin: residence.factaObligations?.tin ?? '',
        nss: residence.factaObligations?.nss ?? '',
      },
    })),
  };
}
