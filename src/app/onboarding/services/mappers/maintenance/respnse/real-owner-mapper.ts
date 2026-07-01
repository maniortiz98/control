import { formatDateYYYYMMDD } from "../../../../../shared/utils/datetime";
import { compareAndReturnIdRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from "../../../../../shared/utils/map-rfc-nif-tin-nss";
import { compareGenderAndReturnValue } from "../../../../../shared/utils/maper-gender";
import { DataResRealOwner, PpeRelative } from "../../../../models/checkpoints/response/maintenance/real-owner";
import { RealOwnerData } from "../../../../models/real-owner";

export function mapToSignalRealOwnerMant(input: DataResRealOwner): RealOwnerData {
  console.log(input);
  return {
    generalData: {
      id: input.generalData?.rolAccountId ? input.generalData?.rolAccountId : 0,
      personId: input.generalData?.personId ? input.generalData?.personId : 0,
      curp: input.generalData?.curp || '',
      foreignerWithoutCurp: input.generalData?.foreignWithoutCURP || false,
      typeIden: compareAndReturnIdRfcNifTinNss(input.generalData?.rfc || '', input.generalData?.nif || '', input.generalData?.tin || '', input.generalData?.nss || ''),
      rfc: compareAndReturnValueRfcNifTinNss(input.generalData?.rfc || '', input.generalData?.nif || '', input.generalData?.tin || '', input.generalData?.nss || ''),
      firstName: input.generalData?.firstName || '',
      middleName: input.generalData?.middleName || '',
      dateOfBirth: formatDateYYYYMMDD(input.generalData?.dateOfBirth || ''),
      firstLastName: input.generalData?.firstLastName || '',
      secondLastName: input.generalData?.secondLastName || '',
      gender: compareGenderAndReturnValue(Number(input.generalData?.gender) || 0),
      nationality: input.generalData?.nationality || '',
      countryOfBirth: input.generalData?.countryOfBirth || '',
      stateOfBirth: input.generalData?.federalEntity || input.generalData?.cityOfBirth || '',
      countryTaxCodeAbroad: input.generalData?.countryFiscal || '',
      typePerson: input.generalData?.personType || '1',
      relationship: input.generalData?.relationship?.toString() || '',
      field: input.generalData?.fiel || '',
      phone: input.generalData?.phone?.toString() || '',
      mail: input.generalData?.email || '',
      economicActivity: input.generalData?.economicActivity || '',
      expirationDateField: formatDateYYYYMMDD(input.generalData?.fielExpirationDate || ''),
    },
    ppe: {
      id: input.personPpe?.id,
      ppe: input.personPpe?.isPpe || false,
      tppe: input.personPpe?.ppeType || '',
      positionHeld: input.personPpe?.positionHeld || '',
      expirationDate: formatDateYYYYMMDD(input.personPpe?.positionEndDate || ''),
      fppe: input.personPpe?.hasppeRelatives || false,
      dataFamily: input.personPpe?.ppeRelatives?.map((fam: PpeRelative) => {
        return {
          curp: fam.curp || '',
          foreignerWithoutCurp: fam.foreignerWithoutCurp || false,
          typeIden: compareAndReturnIdRfcNifTinNss(fam.rfc || '', fam.nif || '', fam.tin || '', fam.nss || ''),
          rfc: compareAndReturnValueRfcNifTinNss(fam.rfc || '', fam.nif || '', fam.tin || '', fam.nss || ''),
          firstName: fam.firstName || '',
          middleName: fam.middleName || '',
          dateOfBirth: formatDateYYYYMMDD(fam.dateOfBirth || ''),
          firstLastName: fam.firstLastName || '',
          secondLastName: fam.secondLastName || '',
          nationality: fam.nationality || '',
          countryOfBirth: fam.countryOfBirth || '',
          countryTaxCodeAbroad: fam.countryFiscal || '',
          chargeDueDate: fam.positionEndDate || '',
          relationship: fam.relationship?.toString() || '',
          positionHeld: fam.positionHeld || '',
          idM: fam.id,
          personId: fam.personId,
          accountRoleId: fam.accountRoleId,
          //Aqui faltan dos campos active de back para la eliminacion logica
          active: fam.active, // Campo mock para logica solo remplazar nombre
          idS:crypto.randomUUID(), // Id generado para front
        };
      }) || [],
    },
    adrres: {
      id:input.addressRealOwner?.addressId,
      addressType: input.addressRealOwner?.addressType || '',
      other: input.addressRealOwner?.other || '',
      country: input.addressRealOwner?.country || '',
      postalCode: input.addressRealOwner?.postalCode?.toString() || '',
      federalEntity: input.addressRealOwner?.federalEntity || '',
      city: input.addressRealOwner?.city || '',
      municipality: input.addressRealOwner?.municipality || '',
      neighborhood: input.addressRealOwner?.neighborhood?.toString() || '',
      street: input.addressRealOwner?.street || '',
      externalNumber: input.addressRealOwner?.externalNumber?.toString() || '',
      internalNumber: input.addressRealOwner?.internalNumber?.toString() || ''
    }
  };
}
