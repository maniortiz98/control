import {
  creditDataMapToServicePM,
  transformCheckpointToCreditData,
  transformCreditDataForService,
} from './credit-data.mapper';

describe('credit-data.mapper', () => {
  describe('transformCreditDataForService', () => {
    it('debe mapear y convertir los datos de persona fisica', () => {
      const input = {
        generalData: {
          economicActivity: 123,
          economicSector: 'FINANZAS',
          accountType: 'NOMINA',
          yearsOfOperation: '5',
          riskGroup: 'ALTO',
          numberOfEconomicDependents: '2',
        },
        employmentData: {
          hiringDate: '2026-05-10',
          salaried: true,
          salary: '15000',
          paymentPeriod: 'MENSUAL',
          paymentCurrencyType: 'MXN',
          employeeNumber: '  EMP-001  ',
          socialSecurityNumber: '  NSS-123  ',
        },
      };

      const result = transformCreditDataForService(input);

      expect(result).toEqual({
        generalData: {
          economicActivity: '123',
          economicSector: 'FINANZAS',
          accountType: 'NOMINA',
          yearsOfOperation: 5,
          riskGroup: 'ALTO',
          numberOfEconomicDependents: 2,
        },
        employmentData: {
          hiringDate: '10/05/2026',
          salaried: true,
          salary: 15000,
          paymentPeriod: 'MENSUAL',
          paymentCurrencyType: 'MXN',
          employeeNumber: 'EMP-001',
          socialSecurityNumber: 'NSS-123',
        },
      });
    });

    it('debe manejar valores faltantes y tipos no booleanos en salaried', () => {
      const input = {
        generalData: {},
        employmentData: {
          hiringDate: 'fecha-invalida',
          salaried: 'SI',
          salary: undefined,
          employeeNumber: undefined,
          socialSecurityNumber: null,
        },
      };

      const result = transformCreditDataForService(input);

      expect(result).toEqual({
        generalData: {
          economicActivity: null,
          economicSector: undefined,
          accountType: undefined,
          yearsOfOperation: NaN,
          riskGroup: undefined,
          numberOfEconomicDependents: NaN,
        },
        employmentData: {
          hiringDate: '',
          salaried: null,
          salary: NaN,
          paymentPeriod: undefined,
          paymentCurrencyType: undefined,
          employeeNumber: '',
          socialSecurityNumber: '',
        },
      });
    });
  });

  describe('creditDataMapToServicePM', () => {
    it('debe mapear correctamente form y tabla para persona moral', () => {
      const form = {
        economicActivity: 'ACT-01',
        prospectSector: 'SECTOR-01',
        accountType: 'EMPRESARIAL',
        operationYears: 10,
        riskGroup: 'MEDIO',
        dependents: 3,
      };
      const table = [
        {
          currentPosition: 'DIRECTOR',
          firstName: 'JUAN',
          firstSurname: 'PEREZ',
          industryYears: 6,
          middleName: 'CARLOS',
          nationality: 'MX',
          positionYears: 2,
          secondSurname: 'LOPEZ',
        },
      ];

      const result = creditDataMapToServicePM(form, table);

      expect(result).toEqual({
        generalData: {
          economicActivity: 'ACT-01',
          economicSector: 'SECTOR-01',
          accountType: 'EMPRESARIAL',
          yearsOfOperation: 10,
          riskGroup: 'MEDIO',
          numberOfEconomicDependents: 3,
        },
        employmentData: [
          {
            currentPosition: 'DIRECTOR',
            firstName: 'JUAN',
            firstSurname: 'PEREZ',
            industryYears: 6,
            middleName: 'CARLOS',
            nationality: 'MX',
            positionYears: 2,
            secondSurname: 'LOPEZ',
          },
        ],
      });
    });

    it('debe soportar tabla vacia para persona moral', () => {
      const result = creditDataMapToServicePM(
        {
          economicActivity: 'ACT-02',
          prospectSector: 'SECTOR-02',
          accountType: 'BASICA',
          operationYears: 1,
          riskGroup: 'BAJO',
          dependents: 0,
        },
        []
      );

      expect(result.employmentData).toEqual([]);
    });
  });

  describe('transformCheckpointToCreditData', () => {
    it('debe mapear el checkpoint a CreditData manteniendo los valores', () => {
      const input = {
        generalData: {
          economicActivity: 'ACT',
          economicSector: 'SEC',
          accountType: 'TIPO',
          yearsOfOperation: 8,
          riskGroup: 'ALTO',
          numberOfEconomicDependents: 4,
        },
        employmentData: {
          hiringDate: '10/05/2026',
          salaried: false,
          salary: 20000,
          paymentPeriod: 'QUINCENAL',
          paymentCurrencyType: 'USD',
          employeeNumber: 'EMP-10',
          socialSecurityNumber: 'NSS-10',
        },
        active: true,
      };

      const result = transformCheckpointToCreditData(input);

      expect(result).toEqual({
        generalData: {
          economicActivity: 'ACT',
          economicSector: 'SEC',
          accountType: 'TIPO',
          yearsOfOperation: 8,
          riskGroup: 'ALTO',
          numberOfEconomicDependents: 4,
        },
        employmentData: {
          hiringDate: '10/05/2026',
          salaried: false,
          salary: 20000,
          paymentPeriod: 'QUINCENAL',
          paymentCurrencyType: 'USD',
          employeeNumber: 'EMP-10',
          socialSecurityNumber: 'NSS-10',
        },
      });
    });

    it('debe soportar checkpoint con nodos faltantes', () => {
      const result = transformCheckpointToCreditData({} as any);

      expect(result).toEqual({
        generalData: {
          economicActivity: undefined,
          economicSector: undefined,
          accountType: undefined,
          yearsOfOperation: undefined,
          riskGroup: undefined,
          numberOfEconomicDependents: undefined,
        },
        employmentData: {
          hiringDate: undefined,
          salaried: undefined,
          salary: undefined,
          paymentPeriod: undefined,
          paymentCurrencyType: undefined,
          employeeNumber: undefined,
          socialSecurityNumber: undefined,
        },
      });
    });
  });
});
