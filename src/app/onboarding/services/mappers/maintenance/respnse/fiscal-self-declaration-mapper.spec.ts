// import { mapResToSignalFiscalSelfDeclarationM } from './fiscal-self-declaration-mapper';

// import * as dateTimeUtils from '../../../../../shared/utils/datetime';
// import * as autocertificationHelpers from '../../../../../shared/utils/maper-helpers.autocertification';

// import { DataFiscalSelfDeclaration } from '../../../../models/checkpoints/response/fiscal-self-declaration';

// describe('mapResToSignalFiscalSelfDeclarationM', () => {
//   beforeEach(() => {
//     spyOn(dateTimeUtils, 'convertDateBack').and.callFake((date: any) => {
//       if (!date) return '';
//       return `converted-${date}` as any;
//     });

//     spyOn(autocertificationHelpers, 'normalizeBoolean').and.callFake(
//       (value: any) => {
//         if (value === true || value === 'true' || value === 'YES' || value === 1) {
//           return true;
//         }

//         if (
//           value === false ||
//           value === 'false' ||
//           value === 'NO' ||
//           value === 0 ||
//           value === null ||
//           value === undefined
//         ) {
//           return false;
//         }

//         return Boolean(value);
//       },
//     );

//     spyOn(
//       autocertificationHelpers,
//       'mapPersonTypeToDescSafe',
//     ).and.callFake((value: any) => {
//       return value ? `person-type-${value}` : '';
//     });

//     spyOn(
//       autocertificationHelpers,
//       'mapProffOfAddressTypeToDescSafe',
//     ).and.callFake((value: any) => {
//       return value ? `proof-address-${value}` : '';
//     });

//     spyOn(
//       autocertificationHelpers,
//       'mapAutenticationTypeToDescSafe',
//     ).and.callFake((value: any) => {
//       return value ? `autentication-${value}` : '';
//     });
//   });


//   it('debe mapear correctamente todos los campos principales y fiscalResidences', () => {
//     const input = {
//       id: 10,
//       mexicoResident: 'YES',
//       curp: 'CURP123',
//       foreignerWithoutCurp: true,
//       rfc: 'RFC123',
//       name: 'Juan Pérez',
//       fiscalRegimeId: '601',
//       cfdiUse: 'G03',
//       taxPostalCode: '01000',
//       nationality: 'MX',
//       country: 'México',
//       fiscalResidenceAbroad: 'NO',
//       facta: true,
//       crs: false,
//       fiscalResidences: [
//         {
//           personId: 100,
//           active: 1,
//           personType: 'PF',
//           country: 'USA',
//           declarationFiscalResidence: 'true',
//           proofOfAddressType: 'INE',
//           issueDate: '2024-01-01',
//           expirationStatus: 'VIGENTE',
//           expirationDate: '2025-01-01',
//           certificationDate: '2024-02-01',
//           declarationYear: '2024',
//           aditionalDays: '30',
//           factaObligations: {
//             factaId: 200,
//             autentication: 'PASSWORD',
//             nif: 'NIF123',
//             tin: 'TIN123',
//             nss: 'NSS123',
//           },
//         },
//       ],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result).toEqual({
//       id: 10,
//       mexicoResident: true,
//       curp: 'CURP123',
//       foreignerWithoutCurp: true,
//       rfc: 'RFC123',
//       name: 'Juan Pérez',
//       fiscalRegimeId: '601',
//       cfdiUse: 'G03',
//       taxPostalCode: '01000',
//       nationality: 'MX',
//       country: 'México',
//       fiscalResidenceAbroad: false,
//       facta: true,
//       crs: false,
//       fiscalResidences: [
//         {
//           personId: 100,
//           active: true,
//           personType: 'person-type-PF',
//           country: 'USA',
//           declarationFiscalResidence: true,
//           proofOfAddressType: 'proof-address-INE',
//           issueDate: 'converted-2024-01-01',
//           expirationStatus: 'VIGENTE',
//           expirationDate: 'converted-2025-01-01',
//           certificationDate: 'converted-2024-02-01',
//           declarationYear: 2024,
//           aditionalDays: '30',
//           factaObligations: {
//             factaId: 200,
//             autentication: 'autentication-PASSWORD',
//             nif: 'NIF123',
//             tin: 'TIN123',
//             nss: 'NSS123',
//           },
//         },
//       ],
//     } as any);

//     expect(autocertificationHelpers.normalizeBoolean).toHaveBeenCalledWith(
//       'YES',
//     );
//     expect(autocertificationHelpers.normalizeBoolean).toHaveBeenCalledWith(
//       'NO',
//     );
//     expect(autocertificationHelpers.normalizeBoolean).toHaveBeenCalledWith(
//       true,
//     );
//     expect(autocertificationHelpers.normalizeBoolean).toHaveBeenCalledWith(
//       false,
//     );

//     expect(
//       autocertificationHelpers.mapPersonTypeToDescSafe,
//     ).toHaveBeenCalledWith('PF');

//     expect(
//       autocertificationHelpers.mapProffOfAddressTypeToDescSafe,
//     ).toHaveBeenCalledWith('INE');

//     expect(
//       autocertificationHelpers.mapAutenticationTypeToDescSafe,
//     ).toHaveBeenCalledWith('PASSWORD');

//     expect(dateTimeUtils.convertDateBack).toHaveBeenCalledWith('2024-01-01');
//     expect(dateTimeUtils.convertDateBack).toHaveBeenCalledWith('2025-01-01');
//     expect(dateTimeUtils.convertDateBack).toHaveBeenCalledWith('2024-02-01');
//   });

//   it('debe usar valores por defecto cuando los campos principales vienen null o undefined', () => {
//     const input = {
//       id: undefined,
//       mexicoResident: null,
//       curp: null,
//       rfc: undefined,
//       name: null,
//       fiscalRegimeId: undefined,
//       cfdiUse: null,
//       taxPostalCode: undefined,
//       nationality: null,
//       country: undefined,
//       fiscalResidenceAbroad: undefined,
//       facta: null,
//       crs: undefined,
//       fiscalResidences: undefined,
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result).toEqual({
//       id: undefined,
//       mexicoResident: false,
//       curp: '',
//       foreignerWithoutCurp: false,
//       rfc: '',
//       name: '',
//       fiscalRegimeId: '',
//       cfdiUse: '',
//       taxPostalCode: '',
//       nationality: '',
//       country: '',
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [],
//     } as any);

//     expect(result.fiscalResidences).toEqual([]);
//   });

//   it('debe tomar foreignerWithoutCurp cuando existe', () => {
//     const input = {
//       mexicoResident: false,
//       foreignerWithoutCurp: true,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.foreignerWithoutCurp).toBeTrue();
//   });

//   it('debe tomar foreignWithoutCURP cuando foreignerWithoutCurp no existe', () => {
//     const input = {
//       mexicoResident: false,
//       foreignWithoutCURP: true,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.foreignerWithoutCurp).toBeTrue();
//   });

//   it('debe priorizar foreignerWithoutCurp sobre foreignWithoutCURP', () => {
//     const input = {
//       mexicoResident: false,
//       foreignerWithoutCurp: false,
//       foreignWithoutCURP: true,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.foreignerWithoutCurp).toBeFalse();
//   });

//   it('debe asignar false a foreignerWithoutCurp cuando no viene ningún campo relacionado', () => {
//     const input = {
//       mexicoResident: false,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.foreignerWithoutCurp).toBeFalse();
//   });

//   it('debe mapear fiscalResidences como arreglo vacío cuando viene null', () => {
//     const input = {
//       mexicoResident: false,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: null,
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.fiscalResidences).toEqual([]);
//   });

//   it('debe mapear valores por defecto dentro de fiscalResidences cuando vienen null o undefined', () => {
//     const input = {
//       mexicoResident: false,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [
//         {
//           personId: undefined,
//           active: null,
//           personType: null,
//           country: null,
//           declarationFiscalResidence: undefined,
//           proofOfAddressType: null,
//           issueDate: null,
//           expirationStatus: undefined,
//           expirationDate: undefined,
//           certificationDate: null,
//           declarationYear: undefined,
//           aditionalDays: null,
//           factaObligations: undefined,
//         },
//       ],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.fiscalResidences).toEqual([
//       {
//         personId: undefined,
//         active: false,
//         personType: '',
//         country: '',
//         declarationFiscalResidence: false,
//         proofOfAddressType: '',
//         issueDate: '',
//         expirationStatus: '',
//         expirationDate: '',
//         certificationDate: '',
//         declarationYear: 0,
//         aditionalDays: '',
//         factaObligations: {
//           factaId: null,
//           autentication: '',
//           nif: '',
//           tin: '',
//           nss: '',
//         },
//       },
//     ] as any);

//     expect(dateTimeUtils.convertDateBack).toHaveBeenCalledWith(null);
//     expect(dateTimeUtils.convertDateBack).toHaveBeenCalledWith(undefined);
//   });

//   it('debe asignar declarationYear en 0 cuando no es numérico', () => {
//     const input = {
//       mexicoResident: false,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [
//         {
//           declarationYear: 'ABC',
//         },
//       ],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.fiscalResidences?.[0].declarationYear).toBe(0);
//   });

//   it('debe convertir declarationYear numérico correctamente', () => {
//     const input = {
//       mexicoResident: false,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [
//         {
//           declarationYear: 2023,
//         },
//         {
//           declarationYear: '2024',
//         },
//       ],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.fiscalResidences?.[0].declarationYear).toBe(2023);
//     expect(result.fiscalResidences?.[1].declarationYear).toBe(2024);
//   });

//   it('debe mapear factaObligations con valores por defecto cuando sus propiedades vienen null o undefined', () => {
//     const input = {
//       mexicoResident: false,
//       fiscalResidenceAbroad: false,
//       facta: false,
//       crs: false,
//       fiscalResidences: [
//         {
//           factaObligations: {
//             factaId: undefined,
//             autentication: null,
//             nif: null,
//             tin: undefined,
//             nss: null,
//           },
//         },
//       ],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.fiscalResidences?.[0].factaObligations).toEqual({
//       factaId: null,
//       autentication: '',
//       nif: '',
//       tin: '',
//       nss: '',
//     });
//   });

//   it('debe mapear múltiples fiscalResidences correctamente', () => {
//     const input = {
//       id: 99,
//       mexicoResident: true,
//       fiscalResidenceAbroad: true,
//       facta: true,
//       crs: true,
//       fiscalResidences: [
//         {
//           personId: 1,
//           active: true,
//           personType: 'PF',
//           country: 'MX',
//           declarationFiscalResidence: true,
//           proofOfAddressType: 'PASSPORT',
//           issueDate: '2020-01-01',
//           expirationStatus: 'VIGENTE',
//           expirationDate: '2030-01-01',
//           certificationDate: '2024-01-01',
//           declarationYear: '2024',
//           aditionalDays: 15,
//           factaObligations: {
//             factaId: 10,
//             autentication: 'A1',
//             nif: 'NIF1',
//             tin: 'TIN1',
//             nss: 'NSS1',
//           },
//         },
//         {
//           personId: 2,
//           active: false,
//           personType: 'PM',
//           country: 'US',
//           declarationFiscalResidence: false,
//           proofOfAddressType: 'RECEIPT',
//           issueDate: '2021-02-02',
//           expirationStatus: 'EXPIRADO',
//           expirationDate: '2022-02-02',
//           certificationDate: '2023-02-02',
//           declarationYear: '2023',
//           aditionalDays: 30,
//           factaObligations: {
//             factaId: 20,
//             autentication: 'A2',
//             nif: 'NIF2',
//             tin: 'TIN2',
//             nss: 'NSS2',
//           },
//         },
//       ],
//     } as unknown as DataFiscalSelfDeclaration;

//     const result = mapResToSignalFiscalSelfDeclarationM(input);

//     expect(result.fiscalResidences?.length).toBe(2);

//     expect(result.fiscalResidences?.[0]).toEqual({
//       personId: 1,
//       active: true,
//       personType: 'person-type-PF',
//       country: 'MX',
//       declarationFiscalResidence: true,
//       proofOfAddressType: 'proof-address-PASSPORT',
//       issueDate: 'converted-2020-01-01',
//       expirationStatus: 'VIGENTE',
//       expirationDate: 'converted-2030-01-01',
//       certificationDate: 'converted-2024-01-01',
//       declarationYear: 2024,
//       aditionalDays: 15,
//       factaObligations: {
//         factaId: 10,
//         autentication: 'autentication-A1',
//         nif: 'NIF1',
//         tin: 'TIN1',
//         nss: 'NSS1',
//       },
//     } as any);

//     expect(result.fiscalResidences?.[1]).toEqual({
//       personId: 2,
//       active: false,
//       personType: 'person-type-PM',
//       country: 'US',
//       declarationFiscalResidence: false,
//       proofOfAddressType: 'proof-address-RECEIPT',
//       issueDate: 'converted-2021-02-02',
//       expirationStatus: 'EXPIRADO',
//       expirationDate: 'converted-2022-02-02',
//       certificationDate: 'converted-2023-02-02',
//       declarationYear: 2023,
//       aditionalDays: 30,
//       factaObligations: {
//         factaId: 20,
//         autentication: 'autentication-A2',
//         nif: 'NIF2',
//         tin: 'TIN2',
//         nss: 'NSS2',
//       },
//     } as any);
//   });
// });
