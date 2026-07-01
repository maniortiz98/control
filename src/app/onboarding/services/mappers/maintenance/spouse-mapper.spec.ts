import {
  mapToCheckpointSpouse,
  mapToCheckpointToSignalSpouse,
} from './spouse-mapper';
import { SpouseData as SpouseSectionData } from '../../../models/spouse';
import { DataSpouse, DataSpouseId } from '../../../models/checkpoints/maintenance/spouse-checkpoint';

describe('spouse-mapper', () => {
  const baseInput: SpouseSectionData = {
    generalData: {
      curp: 'CURP123',
      foreignerWithoutCurp: false,
      typeIden: '1',
      rfc: 'RFC010101AAA',
      firstName: 'JUAN',
      middleName: 'CARLOS',
      dateOfBirth: '2026-05-10',
      firstLastName: 'PEREZ',
      secondLastName: 'LOPEZ',
      gender: 'H',
      occupation: 'EMPLEADO',
      economicActivity: 'SERVICIOS',
    },
    adrres: {
      addressType: 'CASA',
      other: '',
      country: 'MX',
      postalCode: '01000',
      federalEntity: 'CDMX',
      city: 'ALVARO OBREGON',
      municipality: 'ALVARO OBREGON',
      neighborhood: 'FLORIDA',
      street: 'INSURGENTES',
      externalNumber: '100',
      internalNumber: '2',
      federalEntityID: '09',
      cityID: '001',
      municipalityID: '010',
    },
  };

  const ids: DataSpouseId = {
    SpouseDataId: { id: 10, personId: 20 },
    WorkingFieldsSpouseId: { id: 30 },
    AddressSpouseId: { id: 40 },
  };

  describe('mapToCheckpointSpouse', () => {
    const ids: DataSpouseId = {
      SpouseDataId: { id: null, personId: null },
      WorkingFieldsSpouseId: { id: null },
      AddressSpouseId: { id: null },
    };
    it('debe mapear alta nueva sin IDs adicionales', () => {
      const result = mapToCheckpointSpouse(baseInput, true, ids);

      expect(result).toEqual({
        spousedata: {
          curp: 'CURP123',
          foreignerWithoutCurp: false,
          rfc: 'RFC010101AAA',
          nif: '',
          tin: '',
          nss: '',
          firstName: 'JUAN',
          middleName: 'CARLOS',
          firstLastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          dateOfBirth: '10/05/2026',
          gender: '2',
          id: null,
          personId: null,
        },
        workingfields: {
          occupation: 'EMPLEADO',
          businessActivity: 'SERVICIOS',
          id: null,
        },
        address: {
          addressType: 'CASA',
          other: '',
          country: 'MX',
          postalCode: '01000',
          federalEntity: '09',
          municipality: '010',
          city: '001',
          neighborhood: 'FLORIDA',
          street: 'INSURGENTES',
          externalNumber: '100',
          internalNumber: '2',
          id: null,
        },
      });
    });

    it('debe mapear actualización incluyendo IDs y dirección no-MX', () => {
      const input: SpouseSectionData = {
        ...baseInput,
        generalData: {
          ...baseInput.generalData,
          typeIden: '2',
          rfc: 'NIF-ABC',
          gender: 'M',
        },
        adrres: {
          ...baseInput.adrres,
          country: 'US',
          federalEntity: 'TEXAS',
          city: 'DALLAS',
          municipality: 'DALLAS COUNTY',
        },
      };
      const ids: DataSpouseId = {
        SpouseDataId: { id: 10, personId: 20 },
        WorkingFieldsSpouseId: { id: 30 },
        AddressSpouseId: { id: 40 },
      };
      const result = mapToCheckpointSpouse(input, false, ids);

      expect(result).toEqual({
        spousedata: {
          curp: 'CURP123',
          foreignerWithoutCurp: false,
          rfc: '',
          nif: 'NIF-ABC',
          tin: '',
          nss: '',
          firstName: 'JUAN',
          middleName: 'CARLOS',
          firstLastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          dateOfBirth: '10/05/2026',
          gender: '1',
          id: 10,
          personId: 20,
        },
        workingfields: {
          occupation: 'EMPLEADO',
          businessActivity: 'SERVICIOS',
          id: 30,
        },
        address: {
          addressType: 'CASA',
          other: '',
          country: 'US',
          postalCode: '01000',
          federalEntity: 'TEXAS',
          municipality: 'DALLAS COUNTY',
          city: 'DALLAS',
          neighborhood: 'FLORIDA',
          street: 'INSURGENTES',
          externalNumber: '100',
          internalNumber: '2',
          id: 40,
        },
      });
    });
  });

  describe('mapToCheckpointToSignalSpouse', () => {
    it('debe mapear DataSpouse a formato signal', () => {
      const checkpoint: DataSpouse = {
        spousedata: {
          id: 10,
          personId: 20,
          curp: 'CURP123',
          foreignerWithoutCurp: false,
          rfc: 'RFC010101AAA',
          nif: '',
          tin: '',
          nss: '',
          firstName: 'JUAN',
          middleName: 'CARLOS',
          firstLastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          dateOfBirth: '10/05/2026',
          gender: '2',
        },
        workingfields: {
          id: 30,
          occupation: 'EMPLEADO',
          businessActivity: 'SERVICIOS',
        },
        address: {
          id: 40,
          addressType: 'CASA',
          other: '',
          country: 'MX',
          federalEntity: '09',
          postalCode: '01000',
          city: '001',
          municipality: '010',
          neighborhood: 'FLORIDA',
          street: 'INSURGENTES',
          externalNumber: '100',
          internalNumber: '2',
        },
      };

      const result = mapToCheckpointToSignalSpouse(checkpoint);

      expect(result).toEqual({
        spousedata: {
          id: 10,
          personId: 20,
          curp: 'CURP123',
          foreignerWithoutCurp: false,
          rfc: 'RFC010101AAA',
          nif: '',
          tin: '',
          nss: '',
          firstName: 'JUAN',
          middleName: 'CARLOS',
          firstLastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          dateOfBirth: '2026-05-10',
          gender: 'H',
        },
        workingfields: {
          id: 30,
          occupation: 'EMPLEADO',
          businessActivity: 'SERVICIOS',
        },
        address: {
          id: 40,
          addressType: 'CASA',
          other: '',
          country: 'MX',
          federalEntity: '09',
          postalCode: '01000',
          city: '001',
          municipality: '010',
          neighborhood: 'FLORIDA',
          street: 'INSURGENTES',
          externalNumber: '100',
          internalNumber: '2',
        },
      });
    });

    it('debe regresar null cuando recibe objeto vacío', () => {
      const result = mapToCheckpointToSignalSpouse({} as DataSpouse);
      expect(result).toBeNull();
    });
  });
});
