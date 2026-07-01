import { FormGroup } from '@angular/forms';
import { Executor, GeneralInfoCheckpoint, GeneralInfoExecutorSection, GeneralInfoSection, GeneralInfoCheckpointOnboarding } from '../../models/checkpoints/general-info-checkpoint';
import { Address } from '../../models/address';
import { convertDate, convertDateBack, convertStringToDate, convertStringToDateOrEmpty, formatDateSimple, formatDateYYYYMMDD } from '../../../shared/utils/datetime';
import { ExecutorInfo, ExecutorTableInfo } from '../../models/executor';
import { GeneralInfoContract } from '../../models/general-info';
import { AccountManagement } from '../../models/checkpoints/maintenance/general-info-pf-mant-checkpoint';
import { CI_GeneralInformation } from '../../../shared/models/customer';
import { AllowedValuesRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { compareAndReturnGender, compareGenderAndReturnValue } from '../../../shared/utils/maper-gender';
import { PhoneType } from '../../models/phone-type';
import { Countries } from '../../models/country';
import { IdentificationType } from '../../models/identification-type';
import { determineTypeIndent, rfcNifTinSsnValue } from './signature-mapper';


export function generalInfoToCheckpoint(request: GeneralInfoSection, data: GeneralInfoExecutorSection): GeneralInfoCheckpointOnboarding{

  const executors: Executor[] = data.executors
  .filter(item => item.active)
  .map(item => ({
    curp: item.dataSection?.curp ?? '',
    foreignerWithoutCurp: item.dataSection?.foreignerWithoutCurp ?? false,
    rfc: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.RFC ? item.dataSection.rfc : '',
    nif: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.NIF ? item.dataSection.rfc : '',
    tin: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.TIN ? item.dataSection.rfc : '',
    nss: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.SSN ? item.dataSection.rfc : '',
    firstName: item.dataSection?.firstName ?? '',
    middleName: item.dataSection?.middleName ?? '',
    firstLastName: item.dataSection?.firstLastName ?? '',
    secondLastName: item.dataSection?.secondLastName ?? '',
    dateOfBirth: convertDate(item.dataSection?.dateOfBirth ?? '').toString(),
    gender: compareAndReturnGender(item.dataSection?.gender ?? ''),
    maritalStatus: Number(item.dataSection?.maritalStatus) ?? 0,
    nacionality: item.dataSection?.nationality ?? '',
    countryOfBirth: item.dataSection?.countryOfBirth ?? '',
    federalEntity: item.dataSection?.stateOfBirth ?? '',
    relationship: Number(item.taxSection?.relationship) ?? 0,
    economicActivity: item.taxSection?.economicActivity ?? '',
    companyName: item.taxSection?.workCompany ?? '',
    positionHeld: item.taxSection?.positionHeld ?? '',
    phoneBussiness: item.taxSection?.phoneBusiness ?? '',
    fiscalCountry: item.taxSection?.fiscalCountry ?? '',
    fiscalIdentificationNumber: item.dataSection?.typeIden === AllowedValuesRfcNifTinNss.NIF ? item.dataSection.rfc : '',
    signatureType: item.taxSection?.signClass ?? '',
    IPABCoverage: item.taxSection?.ipabTitularityPercent.toString() ?? '',
    incomeTaxWithholding: item.taxSection?.retentionIsr.toString() ?? '',
    personPpe: {
      isPpe: item.ppeInfo?.ppe ?? false,
      ppeType: item.ppeInfo?.tppe ?? '',
      positionHeld: item.ppeInfo?.positionHeld ?? '',
      positionEndDate: convertDate(item.ppeInfo?.expirationDate ?? '').toString(),
      hasppeRelatives: item.ppeInfo?.fppe ?? false,
      ppeRelatives: item.ppeInfo?.dataFamily.map(p => ({
        curp: p.curp ?? '',
        foreignerWithoutCurp: p.foreignerWithoutCurp ?? '',
        rfc: p.typeIden === AllowedValuesRfcNifTinNss.RFC ? p.rfc : '',
        nif: p.typeIden === AllowedValuesRfcNifTinNss.NIF ? p.rfc : '',
        tin: p.typeIden === AllowedValuesRfcNifTinNss.TIN ? p.rfc : '',
        nss: p.typeIden === AllowedValuesRfcNifTinNss.SSN ? p.rfc : '',
        firstName: p.firstName ?? '',
        middleName: p.middleName ?? '',
        firstLastName: p.firstLastName ?? '',
        secondLastName: p.secondLastName ?? '',
        dateOfBirth: formatDateSimple(p.dateOfBirth ?? ''),
        maritalStatus: '1',
        nationality: p.nationality ?? '',
        countryOfBirth: p.countryOfBirth ?? '',
        federalEntity: '',
        relationship: Number(p.relationship) ?? 0,
        positionHeld: p.positionHeld ?? '',
        positionEndDate: convertDate(p.chargeDueDate ?? '').toString(),
      })) ?? []
    },
    identification: item.identifications
    .filter(item => item?.active === true)
    .map(i => ({
      countryOfIdentification: i.identificationCountryId ?? '',
      identificationType: i.identificationTypeId ?? '',
      identificationNumber: i.identificationNumber ?? '',
      expirationDate: i.identificationExpDate ?? ''
    })),
    residentialAddress: {
      addressRol: item.address?.addressRole ?? '',
      addressType: item.address?.addressType ?? '',
      other: item.address?.other ?? '',
      country: item.address?.country ?? '',
      street: item.address?.street ?? '',
      externalNumber: item.address?.externalNumber ?? '',
      internalNumber: item.address?.internalNumber ?? '',
      postalCode: item.address?.postalCode ?? '',
      federalEntity: item.address?.country === 'MX' ? item.address?.federalEntityID ?? '' : item.address?.federalEntity ?? '',
      city: item.address?.country === 'MX' ? item.address?.cityID ?? '' : item.address?.city ?? '',
      municipality: item.address?.country === 'MX' ? item.address?.municipalityID ?? '' : item.address?.municipality ?? '',
      neighborhood: item.address?.neighborhood ?? '',
      geographicalArea: '',
      deliveryCenter: '',
    },
    fiscalSelfDeclaration: {
      residesInMexico: item.autoSign?.mexicoResident ?? false,
      SATRegisteredName: item.autoSign?.name ?? '',
      fiscalRegime: item.autoSign?.fiscalRegimeId.toString() ?? '',
      useCFDI: item.autoSign?.cfdiUse ?? '',
      taxPostalCode: item.autoSign?.taxPostalCode ?? '',
      expirationStatus: '',
      facta: item.autoSign?.facta ?? false,
      foreignTaxResident: item.autoSign?.crs ?? false,
      taxAddress: item.autoSign?.fiscalResidences.map(f => ({
        taxAddress: {
          personType: f.personType != null ? f.personType.toString() : '',
          fiscalResidence: '',
          selfCertification: f.declarationFiscalResidence ?? '',
          proofOfTaxResidency: f.proofOfAddressType ?? '',
          certificationDate: f.certificationDate ?? '',
          declarationYear: Number(f.declarationYear) ?? 0,
          issueDate: f.issueDate,
          expirationStatus: f.expirationStatus,
          expirationDate: f.expirationDate,
          aditionalDays: f.aditionalDays,
        },
        fatcaCompliance: {
          autentication: f.factaObligations.autentication ?? '',
          nif: f.factaObligations.nif ?? '',
          tin: f.factaObligations.tin ?? '',
          nss: f.factaObligations?.nss != null ? f.factaObligations.nss.toString() : '',
        },
        taxAddressActive: f.declarationFiscalResidence ?? false,
      })) ?? []
    },
    contactData: {
      DataNonDisclosureLetter: false,
      registeredPhones: item.phones
      .filter(item => item?.active === true)
      .map(p => ({
        type: Number(p.phoneTypeId) ?? 0,
        country: p.phoneCountryId ?? '',
        areaCode: p.phoneCodeArea ?? '',
        phone: p.phone.toString() ?? '',
        extension: p.phoneExtension ?? '',
        notificationPhone: p.phoneNotification ?? false,
      })),
      registeredEmails: item.mails
      .filter(item => item?.active === true)
      .map(m => ({
        emailAddress: m.mail ?? '',
        notificationEmail: m.mailNotification ?? false,
      }))
    }
  }))

  return {
      personClassification: request.personClassification,
      economicActivity: request.economicActivity,
      maritalStatus: request.maritalStatus,
      marriageType: request.marriageType == "" ? '0': request.marriageType ?? '0',
      sector: request.sector,
      actinverEmployee: request.actinverEmployee,
      employeeNumber: request.employeeNumber ?? '',
      occupation: request.occupation,
      profession: request.profession,
      companyName: request.companyName ?? '',
      jobTitle: request.jobTitle ?? '',
      companyPhone: request.companyPhone ?? '',
      country: request.country,
      street: request.street,
      externalNumber: request.externalNumber,
      internalNumber: request.internalNumber,
      postalCode: request.postalCode,
      federalEntity: request.country === "MX" ? request.federalEntityID : request.federalEntity,
      city: request.country === "MX" ? request.cityID : request.city,
      municipality: request.country === "MX" ? request.municipalityID : request.municipality,
      website: request.website,
      related: request.related,
      relationship: request.related ? request.relationship : "",
      institutionName: request.related ? request.institutionName : "",
      fiel: request.fiel ?? '',
      fielExpirationDate: request.fiel !== "" ? convertDate(request.fielExpirationDate).toString(): "",
      banxicoAuthorization: request.banxicoAuthorization ?? '',
      nonGuaranteedByIPAB: request.nonGuaranteedByIPAB,
      acting: request.acting ?? false,
      hasSupplier: request.hasSupplier ?? false,
      operatesChanges: request.operatesChanges,
      addressType: request.domicilieType,
      neighborhood: request.colony,
      //TODO cuando el servicio este listo, enviar los executors y colocarlo como obligatorio en la interfaz
      //executors: executors
    }
}

export function checkpointToGeneralInfo(request: GeneralInfoCheckpoint): GeneralInfoSection{
  return {
    personClassification: request.personClassification,
    economicActivity: request.economicActivity,
    maritalStatus: request.maritalStatus,
    marriageType: request.marriageType,
    sector: request.sector,
    actinverEmployee: request.actinverEmployee,
    employeeNumber: request.employeeNumber ?? '',
    occupation: request.occupation,
    profession: request.profession,
    companyName: request.companyName ?? '',
    jobTitle: request.jobTitle ?? '',
    companyPhone: request.companyPhone ?? '',
    country: request.country,
    street: request.street,
    externalNumber: request.externalNumber,
    internalNumber: request.internalNumber,
    postalCode: request.postalCode,
    federalEntity: request.country !== "MX" ? request.federalEntity : '',
    city: request.country !== "MX" ? request.city : '',
    municipality: request.country !== "MX" ? request.municipality : '',
    federalEntityID: request.country === "MX" ? request.federalEntity : '',
    cityID: request.country === "MX" ? request.city : '',
    municipalityID: request.country === "MX" ? request.municipality : '',
    website: request.website,
    related: request.related,
    relationship: request.relationship,
    institutionName: request.institutionName,
    fiel: request.fiel,
    fielExpirationDate: request.fiel !== "" ? convertDate(request.fielExpirationDate).toString(): "",
    banxicoAuthorization: request.banxicoAuthorization,
    nonGuaranteedByIPAB: request.nonGuaranteedByIPAB,
    acting: request.acting,
    hasSupplier: request.hasSupplier,
    mensajesMt940: (request as any).mensajesMt940 ?? false,
    codigoSwiftBic: (request as any).codigoSwiftBic ?? '',
    operatesChanges: request.operatesChanges,
    domicilieType: request.addressType,
    colony: request.neighborhood
  };
}

export async function checkpointToGeneralInfoExecutors(request: GeneralInfoCheckpointOnboarding, phoneTypes: PhoneType[], countries: Countries[], identifications: IdentificationType[]): Promise<GeneralInfoExecutorSection>{

    const executorsListSection: ExecutorInfo[] = request.executors?.map((cot, index) => ({
      active: true,
        executorNumber: index + 1,
        clientNumber: '-', //TODO es necesario un client number opcional
        isActiveExecutor: true, //TODO revisar el dto
        personId: null,
        executorId: crypto.randomUUID(),
        dataSection: {
          ppe: false,
          bankAreaTypeId: '',
          contraTypeId: '',
          typeContractSubtypeId: '',
          curp: cot.curp,
          foreignerWithoutCurp: cot.foreignerWithoutCurp,
          typeIden: determineTypeIndent(cot),
          rfc: rfcNifTinSsnValue(cot),
          dateOfBirth: formatDateYYYYMMDD(cot.dateOfBirth),
          gender: compareGenderAndReturnValue(cot.gender),
          maritalStatus: cot.maritalStatus.toString(),
          nationality: cot.nacionality,
          countryOfBirth: cot.countryOfBirth,
          stateOfBirth: cot.federalEntity,
          cityOfBirth: '',
          firstName: cot.firstName,
          middleName: cot.middleName,
          firstLastName: cot.firstLastName,
          secondLastName: cot.secondLastName,
        },
        taxSection: {
          relationship: cot.relationship?.toString() ?? '',
          economicActivity: cot.economicActivity,
          occupation: '', //TODO revisar
          profession: '', //TODO revisar

          workCompany: cot.companyName,
          positionHeld: cot.positionHeld,
          phoneBusiness: cot.phoneBussiness,

          fiscalCountry: cot.fiscalCountry,
          fiscalIdentificationNumber: cot.fiscalIdentificationNumber,

          ipabTitularityPercent: Number(cot.IPABCoverage),
          retentionIsr: Number(cot.incomeTaxWithholding),
          signClass: cot.signatureType,
        },
        address: {
          addressRole: cot.residentialAddress.addressRol,
          addressType: cot.residentialAddress.addressType,
          other: cot.residentialAddress.other,
          country: cot.residentialAddress.country,
          postalCode: cot.residentialAddress.postalCode,
          federalEntity: cot.residentialAddress.country !== "MX" ? cot.residentialAddress.federalEntity : '',
          city: cot.residentialAddress.country !== "MX" ? cot.residentialAddress.city : '',
          municipality: cot.residentialAddress.country !== "MX" ? cot.residentialAddress.municipality : '',
          neighborhood: cot.residentialAddress.neighborhood,
          street: cot.residentialAddress.street,
          externalNumber: cot.residentialAddress.externalNumber,
          internalNumber: cot.residentialAddress.internalNumber,
          confirmCp: '',
          timeLiveMexico: '',
          reasonsOpeningContractMexico: '',
          proofOfAddressType: '',
          addressProofIssueDate: '',
          expirationYear: '',
          taxPostalCode: '',
          geographicalArea: '',
          deliveryCenter: '',
          neighborhoodName: '',
          addressConcatenation: '',
          federalEntityID: cot.residentialAddress.country === "MX" ? cot.residentialAddress.federalEntity : '',
          cityID: cot.residentialAddress.country === "MX" ? cot.residentialAddress.city : '',
          municipalityID: cot.residentialAddress.country === "MX" ? cot.residentialAddress.municipality : '',
        },
        autoSign: {
          mexicoResident: cot.fiscalSelfDeclaration.residesInMexico,
          curp: cot.curp,
          foreignerWithoutCurp: cot.foreignerWithoutCurp,
          rfc: cot.rfc,
          name: cot.fiscalSelfDeclaration.SATRegisteredName,
          fiscalRegimeId: Number(cot.fiscalSelfDeclaration.fiscalRegime),
          cfdiUse: cot.fiscalSelfDeclaration.useCFDI,
          taxPostalCode: cot.fiscalSelfDeclaration.taxPostalCode,
          nationality: cot.nacionality,
          country: cot.countryOfBirth,
          fiscalResidenceAbroad: cot.fiscalSelfDeclaration.taxAddress.length > 1,
          facta: false, //TODO ES NECESARIO GUARDAR Y ENVIAR
          crs: false, //TODO ES NECESARIO GUARDAR Y ENVIAR
          fiscalResidences: cot.fiscalSelfDeclaration.taxAddress.map(res => ({
            tempId: '', //TODO ES NECESARIO GUARDAR Y ENVIAR
            personType: Number(res.taxAddress.personType),
            country: cot.countryOfBirth,
            declarationFiscalResidence: res.taxAddress.selfCertification,
            proofOfAddressType: res.taxAddress.proofOfTaxResidency,
            issueDate: '', //TODO ES NECESARIO GUARDAR Y ENVIAR
            expirationStatus: '', //TODO ES NECESARIO GUARDAR Y ENVIAR
            expirationDate: '', //TODO ES NECESARIO GUARDAR Y ENVIAR
            certificationDate: res.taxAddress.certificationDate,
            declarationYear: res.taxAddress.declarationYear,
            aditionalDays: '', //TODO ES NECESARIO GUARDAR Y ENVIAR
            factaObligations: {
              autentication: res.fatcaCompliance.autentication,
              nif: res.fatcaCompliance.nif,
              tin: res.fatcaCompliance.tin,
              nss: res.fatcaCompliance.nss,
            }
          }))
        },
        ppeInfo: {
          ppe: cot.personPpe.isPpe,
          tppe: cot.personPpe.ppeType,
          positionHeld: cot.personPpe.positionHeld,
          expirationDate: cot.personPpe.positionEndDate,
          fppe: cot.personPpe.hasppeRelatives,
          dataFamily: cot.personPpe.ppeRelatives.map(fam => ({
            curp: fam.curp,
            foreignerWithoutCurp: fam.foreignerWithoutCurp,
            rfc: rfcNifTinSsnValue(fam),
            firstName: fam.firstName,
            middleName: fam.middleName,
            dateOfBirth: formatDateYYYYMMDD(fam.dateOfBirth),
            firstLastName: fam.firstLastName,
            secondLastName: fam.secondLastName,
            nationality: fam.nationality,
            countryOfBirth: fam.countryOfBirth ?? '',
            countryTaxCodeAbroad: '', //TODO revisar
            typeIden: determineTypeIndent(fam),
            chargeDueDate: fam.positionEndDate,
            relationship: fam.relationship?.toString()  ?? '',
            positionHeld: fam.positionHeld,
          }))
        },
        identifications: cot.identification.map(i => ({
          id: crypto.randomUUID(),
          identificationCountry: i.countryOfIdentification,
          identificationCountryId: i.countryOfIdentification,
          identificationType: identifications.find(ident => ident.type === i.identificationType)?.text ?? '',
          identificationTypeId: i.identificationType,
          identificationNumber: i.identificationNumber,
          identificationExpDate: i.expirationDate,
          active: true,
        })),
        manifestLetter: cot.contactData.DataNonDisclosureLetter,
        phones: cot.contactData.registeredPhones.map(p =>({
          id: crypto.randomUUID(),
          phone: p.phone,
          phoneType: phoneTypes.find(phone => phone.telephoneTypeId === p.type.toString())?.telephoneType ?? '',
          phoneTypeId: p.type.toString(),
          phoneCountry: countries.find(c => c.countryId === p.country)?.country ?? '',
          phoneCountryId: p.country,
          phoneCodeArea: p.areaCode,
          phoneExtension: p.extension,
          phoneNotification: p.notificationPhone,
          active: true,
        })),
        mails: cot.contactData.registeredEmails.map(m => ({
          id: crypto.randomUUID(),
          mail: m.emailAddress,
          mailNotification: m.notificationEmail,
          active: true,
        }))
    })) ?? [];

  const exectutorTable = executorsListSection.map(e => mapToExecutorTable(e,
    (e?.address?.federalEntity ?? 'N/A') + ", " + (countries.find(c => c.countryId === (e?.address?.country ?? ''))?.country ?? 'N/A')
  ))

  const showSection = (request?.executors?.length ?? 0) > 0;
  return {
    showExecutors: showSection,
    executors: executorsListSection,
    executorsTable: exectutorTable
  }
}

export function mapGeneralInfoToForm(storage: GeneralInfoSection) {
  return {
    personClasification: storage.personClassification,
    economicActivity: storage.economicActivity,
    ocupation: storage.occupation,
    sector: storage.sector,
    actinverEmployee: storage.actinverEmployee,
    actinverEmployeeNumber: storage.employeeNumber,
    civilStatus: storage.maritalStatus,
    maritalType: storage.marriageType,

    profession: storage.profession,
    company: storage.companyName,
    charge: storage.jobTitle,
    phoneCompany: storage.companyPhone,
    //webPageEmployee: storage.companyWebPage,

    isParentOfEmployee: storage.related,
    relationship: storage.relationship,
    institutionDenomination: storage.institutionName,
    webPage: storage.website,

    haveBanxicoAutorization: storage.banxicoAuthorization,
    //changeOperation: storage.operatesChanges,
    fiel: storage.fiel,
    expirationFiel: convertDateBack(storage.fielExpirationDate),
    isOwnAccountAct: storage?.acting ?? '',
    haveResourceProvider: storage?.hasSupplier ?? '',
    mensajesMt940: storage.mensajesMt940 ?? false,
    codigoSwiftBic: storage.codigoSwiftBic ?? '',
  };
}

export function mapFormToGeneralInfo(form: FormGroup, formOC: FormGroup, resultDataAddress: Address | null, nonGuaranteedByIPAB: string): GeneralInfoSection {
  const raw = form.getRawValue()
  return {
    personClassification: raw.personClasification,
    economicActivity: raw.economicActivity,
    maritalStatus: raw.civilStatus,
    marriageType: raw.maritalType,
    sector: raw.sector,
    actinverEmployee: raw.actinverEmployee,
    employeeNumber: raw.actinverEmployeeNumber,
    occupation: raw.ocupation,

    profession: raw.profession,
    companyName: raw.company,
    jobTitle: raw.charge,
    companyPhone: raw.phoneCompany,
    //companyWebPage: form.value.webPageEmployee,

    domicilieType: resultDataAddress?.addressType ?? '',
    country: resultDataAddress?.country ?? '',
    postalCode: resultDataAddress?.postalCode ?? '',

    federalEntity: resultDataAddress?.federalEntity ?? '',
    federalEntityID: resultDataAddress?.federalEntityID ?? '',
    city: resultDataAddress?.city ?? '',
    cityID: resultDataAddress?.cityID ?? '',
    municipality: resultDataAddress?.municipality ?? '',
    municipalityID: resultDataAddress?.municipalityID ?? '',
    colony: resultDataAddress?.neighborhood ?? '',

    street: resultDataAddress?.street ?? '',
    externalNumber: resultDataAddress?.externalNumber ?? '',
    internalNumber: resultDataAddress?.internalNumber ?? '',
    website: raw.webPage ?? '',

    related: raw.isParentOfEmployee,
    relationship: raw.relationship,
    institutionName: raw.institutionDenomination,
    fiel: raw.fiel ?? '',
    fielExpirationDate: raw.expirationFiel,

    operatesChanges: formOC.value.changeOperation,
    banxicoAuthorization: raw.haveBanxicoAutorization,
    nonGuaranteedByIPAB: nonGuaranteedByIPAB,
    acting: raw.isOwnAccountAct,
    hasSupplier: raw.haveResourceProvider,
    mensajesMt940: raw.mensajesMt940 ?? false,
    codigoSwiftBic: raw.codigoSwiftBic ?? '',
  };
}

export function mapToExecutorTable(item: ExecutorInfo, direction: string): ExecutorTableInfo {
  return {
    executorId: item.executorId,
    registryNumber: item.executorNumber ?? 0,
    clientNumber: item.clientNumber ?? '',
    fiscalNumber: item.dataSection?.rfc ?? '',
    address: direction,
    contact: item?.phones[0]?.phone ?? '',
    isActiveExecutor: item.isActiveExecutor,
  }
}

export function formToGeneralInfoContractSection(form: FormGroup, initialData: GeneralInfoContract | null ): GeneralInfoContract {
  return {
    id:                         initialData?.id ?? 0,
    generalInformationId:       initialData?.generalInformationId ?? 0,
    personId:                   initialData?.personId ?? 0,
    addressId:                  initialData?.addressId ?? 0,
    workDataId:                 initialData?.workDataId ?? 0,
    clientId:                   initialData?.clientId ?? 0,
    accountRoleId:              initialData?.accountRoleId ?? 0,

    saleForceProspect:          form.getRawValue().saleForceProspect ?? form.getRawValue().saleForceProspect,
    clientStatus:               form.getRawValue().clientStatus,
    contractStatus: 			      form.getRawValue().contractStatus ,
    openDate:                   convertDate(form.getRawValue().openDate ?? form.getRawValue().openDate).toString() ,

    initialRiskId:              form.getRawValue().initialRiskId ?? form.getRawValue().initialRiskId,
    initialRiskDescription:     form.getRawValue().initialRiskDescription ?? form.getRawValue().initialRiskDescription,
    modifyRiskId:               form.getRawValue().modifyRiskId ?? form.getRawValue().modifyRiskId,
    modifyRiskDespcription:     form.getRawValue().modifyRiskDespcription ?? form.getRawValue().modifyRiskDespcription,
    origin:                     form.getRawValue().origin ?? form.getRawValue().origin,
    n4UpdateDate:               convertDate(form.getRawValue().n4UpdateDate ?? form.getRawValue().n4UpdateDate).toString() ,
    liverpoolDomicilie:         form.getRawValue().liverpoolDomicilie ?? form.getRawValue().liverpoolDomicilie,

    isNumbered:                 form.getRawValue().isNumbered ,
    //operateCapitals:            form.value.operateCapitals ,

    accountManagementId:        initialData?.accountManagementId ?? null,
    accountLevel:               form.getRawValue().accountLevel ?? form.getRawValue().accountLevel,
    contractDenomination:       form.getRawValue().contractDenomination ,
    PMContractBE:               form.getRawValue().PMContractBE ,
    h2hServices:                form.getRawValue().h2hServices ,
    operateEuros:               form.getRawValue().operateEuros ,
    independentAsesor:          form.getRawValue().independentAsesor ,

    checkProtected:             form.getRawValue().checkProtected ,
    isOwnPosition:              form.getRawValue().isOwnPosition ,
    isSocialPrevision:          form.getRawValue().isSocialPrevision ,
    authorizationConsultCreditReports: form.getRawValue().authorizationConsultCreditReports,
    biometricsAccount:          form.getRawValue().biometricsAccount,
    facialBiometrics:           form.getRawValue().facialBiometrics,
    enrollmentStatus:           form.getRawValue().enrollmentStatus,

    asociatedDirector:          form.getRawValue().asociatedDirector ,
    directPromote:              form.getRawValue().directPromote ,
    financailCenter:            form.getRawValue().financailCenter ,


    isrPercentage:              form.getRawValue().isrPercentage ,
    isrMonthlyCommision:        form.getRawValue().isrMonthlyCommision ,
    comissionPercentage:        form.getRawValue().comissionPercentage ,

    trust:                      form.getRawValue().trust ,
    clientHasTrust:             form.getRawValue().clientHasTrust ,
    brokerageActinverTrust:     form.getRawValue().brokerageActinverTrust ,

    isPMSorety:                 form.getRawValue().isPMSorety ,
    isBrokerageHouse:           form.getRawValue().isBrokerageHouse ,

    externalCustody:            form.getRawValue().externalCustody ,
    custody:                    form.getRawValue().custody,
    custodyIndeval:             form.getRawValue().custodyIndeval,
    financialCenterDelivery:    form.getRawValue().financialCenterDelivery ,
    contractManagement:         form.getRawValue().contractManagement ,
    gestionType:                form.getRawValue().gestionType ,
    vip:                        form.getRawValue().vip ,
    strategyTypes:              form.getRawValue().strategyTypes,
    equityStrategies:           form.getRawValue().strategyTypes ?? [],
    isEquity:                   form.getRawValue().isEquity ?? false,

    operationReason:            form.getRawValue().operationReason ,
    otherReasons:               form.getRawValue().otherReasons ,
    operationConfiramtionMedia: form.getRawValue().operationConfiramtionMedia ,

    documents:                  form.getRawValue().documents ,
    transfers:                  form.getRawValue().transfers ,
    accountDeposit:             form.getRawValue().accountDeposit ,
    other:                      form.getRawValue().other ,
    otherPreferedProduct:       form.getRawValue().otherPreferedProduct ,

    associateDirectorId:        initialData?.associateDirectorId ?? null,
    asociatedDirectorStatus:    form.getRawValue().asociatedDirectorStatus ,
    asociatedDirectorFolio:     form.getRawValue().asociatedDirectorFolio ,
    asociatedDirectorNumber:    form.getRawValue().asociatedDirectorNumber ,
    asociatedDirectorName:      form.getRawValue().asociatedDirectorName ,

    geolocationId:              initialData?.geolocationId ?? null,
    consentGeolocalization:     form.getRawValue().consentGeolocalization ,
    date:                       convertDate(form.getRawValue().date).toString(),
    time:                       form.getRawValue().time,
    latitude:                   form.getRawValue().latitude ,
    longitude:                  form.getRawValue().longitude ,

    incapacity:                 form.getRawValue().incapacity,
    incapacityLetter:           form.getRawValue().incapacityLetter,
    dateOfDefunction:           convertDate(form.getRawValue().dateOfDefunction).toString(),
    codigoSwiftBic:             form.getRawValue().codigoSwiftBic ?? form.getRawValue().codigoSwiftBic,
    mensajesMt940:              form.getRawValue().mensajesMt940 ?? form.getRawValue().mensajesMt940,
  }
}


export function generalInfoContractToForm(contract: GeneralInfoContract, form: FormGroup): void {
  form.patchValue({
    saleForceProspect:           contract.saleForceProspect,
    clientStatus:                contract.clientStatus,
    contractStatus:              contract.contractStatus,
    openDate:                    convertStringToDateOrEmpty(contract.openDate ?? ''),

    initialRiskId:               contract.initialRiskId,
    initialRiskDescription:      contract.initialRiskDescription,
    modifyRiskId:                contract.modifyRiskId,
    modifyRiskDespcription:      contract.modifyRiskDespcription,
    origin:                      contract.origin,
    n4UpdateDate:                convertStringToDateOrEmpty(contract.n4UpdateDate ?? ''),
    liverpoolDomicilie:          contract.liverpoolDomicilie,
    codigoSwiftBic:              contract.codigoSwiftBic,
    mensajesMt940:               contract.mensajesMt940,

    isNumbered:                  contract.isNumbered,
    //operateCapitals:             contract.operateCapitals,

    accountLevel:                contract.accountLevel,
    contractDenomination:        contract.contractDenomination,
    PMContractBE:                contract.PMContractBE,
    h2hServices:                 contract.h2hServices,
    operateEuros:                contract.operateEuros,
    independentAsesor:           contract.independentAsesor,

    checkProtected:              contract.checkProtected,
    isOwnPosition:               contract.isOwnPosition,
    isSocialPrevision:           contract.isSocialPrevision,
    authorizationConsultCreditReports: contract.authorizationConsultCreditReports,
    biometricsAccount:           contract.biometricsAccount,
    facialBiometrics:            contract.facialBiometrics,
    enrollmentStatus:            contract.enrollmentStatus,
    custody:                     contract.custody,
    custodyIndeval:              contract.custodyIndeval,

    asociatedDirector:           contract.asociatedDirector,
    directPromote:               contract.directPromote,
    financailCenter:             contract.financailCenter,

    isrPercentage:               contract.isrPercentage,
    isrMonthlyCommision:         contract.isrMonthlyCommision,
    comissionPercentage:         contract.comissionPercentage,

    trust:                       contract.trust,
    clientHasTrust:              contract.clientHasTrust,
    brokerageActinverTrust:      contract.brokerageActinverTrust,

    isPMSorety:                  contract.isPMSorety,
    isBrokerageHouse:            contract.isBrokerageHouse,

    externalCustody:             contract.externalCustody,
    financialCenterDelivery:     contract.financialCenterDelivery,
    contractManagement:          contract.contractManagement,
    gestionType:                 contract.gestionType,
    vip:                         contract.vip,
    strategyTypes:               contract.strategyTypes,
    equityStrategies:            contract.equityStrategies,
    isEquity:                    contract.isEquity,

    operationReason:             contract.operationReason,
    otherReasons:                contract.otherReasons,
    operationConfiramtionMedia:  contract.operationConfiramtionMedia,

    documents:                   contract.documents,
    transfers:                   contract.transfers,
    accountDeposit:              contract.accountDeposit,
    other:                       contract.other,
    otherPreferedProduct:        contract.otherPreferedProduct,

    asociatedDirectorStatus:     contract.asociatedDirectorStatus,
    asociatedDirectorFolio:      contract.asociatedDirectorFolio,
    asociatedDirectorNumber:     contract.asociatedDirectorNumber,
    asociatedDirectorName:       contract.asociatedDirectorName,

    consentGeolocalization:      contract.consentGeolocalization,
    date:                        convertStringToDateOrEmpty(contract.date  ?? ''),
    time:                        contract.time,
    latitude:                    contract.latitude,
    longitude:                   contract.longitude,

    incapacity:                 contract.incapacity,
    incapacityLetter:           contract.incapacityLetter,
    dateOfDefunction:           convertStringToDateOrEmpty(contract.dateOfDefunction  ?? ''),
  });
}


export function existingClientToGeneralInfo(request: CI_GeneralInformation | null): GeneralInfoSection | null{
  if(!request) {
    return null;
  }
  return {
    personClassification: request.personClassification ?? '',
    economicActivity: request.economicActivity ?? '',
    maritalStatus: request.maritalStatus ?? '',
    marriageType: request.marriageType ?? '',
    sector: request.sector ?? '',
    actinverEmployee: request.actinverEmployee,
    employeeNumber: request.employeeNumber ?? '',
    occupation: request.occupation ?? '',
    profession: request.profession ?? '',
    companyName: request.companyName ?? '',
    jobTitle: request.jobTitle ?? '',
    companyPhone: request.companyPhone ?? '',
    country: request.address?.country ?? '',
    street: request.address?.street ?? '',
    externalNumber: request.address?.externalNumber ?? '',
    internalNumber: request.address?.internalNumber ?? '',
    postalCode: request.address?.postalCode ?? '',
    federalEntity: request.address?.federalEntity ?? '',
    city: request.address?.city ?? '',
    municipality: request.address?.municipality ?? '',
    federalEntityID: request.address?.federalEntity ?? '',
    cityID: request.address?.city ?? '',
    municipalityID: request.address?.municipality ?? '',
    website: request.website  ?? '',
    related: request.related,
    relationship: '',
    institutionName: request.institutionName ?? '',
    fiel: request.fiel  ?? '',
    fielExpirationDate: request.fiel !== "" ? convertDate(request.fielExpirationDate ?? '').toString(): "",
    banxicoAuthorization: '',
    nonGuaranteedByIPAB: '',
    operatesChanges: false,
    domicilieType: request.address?.addressType ?? '',
    colony: request.address?.neighborhood ?? '',
    mensajesMt940: request.mensajesMt940,
    codigoSwiftBic: request.codigoSwiftBic ?? ''
  }
}
