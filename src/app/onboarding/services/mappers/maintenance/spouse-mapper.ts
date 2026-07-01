import { convertDate, convertDateBack, formatDateYYYYMMDD } from "../../../../shared/utils/datetime";
import { AllowedValuesRfcNifTinNss, compareAndReturnIdRfcNifTinNss, compareAndReturnRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from "../../../../shared/utils/map-rfc-nif-tin-nss";
import { compareAndReturnGender, compareGenderAndReturnValue } from "../../../../shared/utils/maper-gender";
import { DataSpouse, DataSpouseId } from "../../../models/checkpoints/maintenance/spouse-checkpoint";
import { SpouseData } from "../../../models/spouse";

export function mapToCheckpointSpouse(input: SpouseData, newData: boolean, id: DataSpouseId): DataSpouse {
  return {
    spousedata: {
      curp: input.generalData.curp ?? '',
      foreignerWithoutCurp: input.generalData.foreignerWithoutCurp ?? false,
      rfc: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.RFC, input.generalData.typeIden),
      nif: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.NIF, input.generalData.typeIden),
      tin: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.TIN, input.generalData.typeIden),
      nss: compareAndReturnRfcNifTinNss(input.generalData.rfc, AllowedValuesRfcNifTinNss.SSN, input.generalData.typeIden),
      firstName: input.generalData.firstName ?? '',
      middleName: input.generalData.middleName ?? '',
      firstLastName: input.generalData.firstLastName ?? '',
      secondLastName: input.generalData.secondLastName ?? '',
      dateOfBirth: convertDate(input.generalData.dateOfBirth ?? '').toString(),
      id: id.SpouseDataId.id != 0 ? id.SpouseDataId.id : null,
      personId: id.SpouseDataId.personId != 0 ? id.SpouseDataId.personId : null,
      gender: compareAndReturnGender(input.generalData.gender ?? '').toString(),
    },
    workingfields: {
      occupation: input.generalData.occupation,
      businessActivity: input.generalData.economicActivity,
      id: id.WorkingFieldsSpouseId.id != 0 ? id.WorkingFieldsSpouseId.id : null,
    },
    address: {
      addressType: input.adrres.addressType ?? '',
      other: input.adrres.other ?? '',
      country: input.adrres.country ?? '',
      postalCode: input.adrres.postalCode ?? '',
      federalEntity: input.adrres.country === 'MX' ? input.adrres.federalEntityID || '' : input.adrres.federalEntity,
      municipality: input.adrres.country === 'MX' ? input.adrres.municipalityID || '' : input.adrres.municipality,
      city: input.adrres.country === 'MX' ? input.adrres.cityID || '' : input.adrres.city,
      neighborhood: input.adrres.neighborhood ?? '',
      street: input.adrres.street ?? '',
      externalNumber: input.adrres.externalNumber ?? '',
      id: id.AddressSpouseId.id != 0 ? id.AddressSpouseId.id : null,
      internalNumber: input.adrres.internalNumber ?? '',
    }
  }
}

export function mapToCheckpointToSignalSpouse(input: DataSpouse): DataSpouse | null {
  if (Object.keys(input).length !== 0) {
    return {
      spousedata: {
        curp: input.spousedata.curp ?? '',
        foreignerWithoutCurp: input.spousedata.foreignerWithoutCurp ?? false,
        rfc: input.spousedata.rfc,
        nif: input.spousedata.nif,
        tin: input.spousedata.tin,
        nss: input.spousedata.nss,
        firstName: input.spousedata.firstName ?? '',
        middleName: input.spousedata.middleName ?? '',
        firstLastName: input.spousedata.firstLastName ?? '',
        secondLastName: input.spousedata.secondLastName ?? '',
        dateOfBirth: formatDateYYYYMMDD(input.spousedata.dateOfBirth || ''),        
        gender: compareGenderAndReturnValue(Number(input.spousedata?.gender) || 0),
        id: input.spousedata.id,
        personId: input.spousedata.personId
      },
      workingfields: {
        occupation: input.workingfields.occupation,
        businessActivity: input.workingfields.businessActivity,
        id: input.workingfields.id
      },
      address: {
        addressType: input.address.addressType ?? '',
        other: input.address.other ?? '',
        country: input.address.country ?? '',
        postalCode: input.address.postalCode ?? '',
        federalEntity: input.address.federalEntity ?? '',
        municipality: input.address.municipality ?? '',
        city: input.address.city ?? '',
        neighborhood: input.address.neighborhood ?? '',
        street: input.address.street ?? '',
        externalNumber: input.address.externalNumber ?? '',
        internalNumber: input.address.internalNumber ?? '',
        id: input.address.id
      }
    }
  } else {
    return null;
  }
}
