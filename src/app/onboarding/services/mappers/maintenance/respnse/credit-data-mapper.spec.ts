import { creditDataMapToServicePF } from './credit-data-mapper';

describe('creditDataMapToServicePF', () => {
  it('debe mapear correctamente todos los datos válidos del formulario y tabla', () => {
    const formMock = {
      economicActivity: {
        lineBusinessId: 123,
      },
      prospectSector: 'privado',
      accountType: 'individual',
      operationYears: '5',
      riskGroup: 'bajo',
      dependents: '2',
      salaried: true,
      hiringDate: '2024-01-15',
      salary: '25000',
      paymentPeriod: 'MENSUAL',
      paymentCurrencyType: 'MXN',
      employeeNumber: ' EMP001 ',
      socialSecurityNumber: ' NSS001 ',
    };

    const tableMock = [
      {
        firstName: ' Juan ',
        middleName: ' Carlos ',
        firstSurname: ' Pérez ',
        secondSurname: ' López ',
        nationality: {
          code: 'MX',
        },
        currentPosition: ' Director ',
        positionYears: '3',
        industryYears: '10',
      },
    ];

    const result = creditDataMapToServicePF(formMock, tableMock);

    expect(result).toEqual({
      generalData: {
        economicActivity: 123,
        economicSector: 'privado',
        accountType: '1',
        yearsOfOperation: 5,
        riskGroup: 'bajo',
        numberOfEconomicDependents: 2,
      },
      employmentData: {
        salaried: true,
        hiringDate: '15/01/2024',
        salary: 25000,
        paymentPeriod: 'MENSUAL',
        paymentCurrencyType: 'MXN',
        employeeNumber: 'EMP001',
        socialSecurityNumber: 'NSS001',
      },
      officers: [
        {
          firstName: 'Juan',
          middleName: 'Carlos',
          firstSurname: 'Pérez',
          secondSurname: 'López',
          nationality: 'MX',
          currentPosition: 'Director',
          positionYears: 3,
          industryYears: 10,
        },
      ],
    });
  });

  it('debe usar valores por defecto cuando form es null y table es null', () => {
    const result = creditDataMapToServicePF(null, null);

    expect(result).toEqual({
      generalData: {
        economicActivity: null,
        economicSector: null,
        accountType: '1',
        yearsOfOperation: null,
        riskGroup: null,
        numberOfEconomicDependents: null,
      },
      employmentData: {
        salaried: null,
        hiringDate: null,
        salary: null,
        paymentPeriod: null,
        paymentCurrencyType: null,
        employeeNumber: null,
        socialSecurityNumber: null,
      },
    });
  });

  it('debe usar valores por defecto cuando form es undefined y table es undefined', () => {
    const result = creditDataMapToServicePF(undefined, undefined);

    expect(result.generalData).toEqual({
      economicActivity: null,
      economicSector: null,
      accountType: '1',
      yearsOfOperation: null,
      riskGroup: null,
      numberOfEconomicDependents: null,
    });

    expect(result.employmentData).toEqual({
      salaried: null,
      hiringDate: null,
      salary: null,
      paymentPeriod: null,
      paymentCurrencyType: null,
      employeeNumber: null,
      socialSecurityNumber: null,
    });

    expect(result.officers).toBeUndefined();
  });

  it('debe retornar officers undefined cuando table no es array', () => {
    const formMock = {};
    const tableMock = {};

    const result = creditDataMapToServicePF(formMock, tableMock);

    expect(result.officers).toBeUndefined();
  });

  it('debe retornar officers undefined cuando table es array vacío', () => {
    const formMock = {};
    const tableMock: any[] = [];

    const result = creditDataMapToServicePF(formMock, tableMock);

    expect(result.officers).toBeUndefined();
  });

  it('debe convertir strings numéricos a number y valores vacíos a null', () => {
    const formMock = {
      operationYears: '',
      dependents: null,
      salary: undefined,
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.yearsOfOperation).toBeNull();
    expect(result.generalData.numberOfEconomicDependents).toBeNull();
    expect(result.employmentData.salary).toBeNull();
  });

  it('debe convertir valores no numéricos a null', () => {
    const formMock = {
      operationYears: 'abc',
      dependents: {},
      salary: 'invalid',
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.yearsOfOperation).toBeNull();
    expect(result.generalData.numberOfEconomicDependents).toBeNull();
    expect(result.employmentData.salary).toBeNull();
  });

  it('debe aceptar números válidos directamente', () => {
    const formMock = {
      operationYears: 8,
      dependents: 4,
      salary: 15000,
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.yearsOfOperation).toBe(8);
    expect(result.generalData.numberOfEconomicDependents).toBe(4);
    expect(result.employmentData.salary).toBe(15000);
  });

  it('debe obtener códigos usando getCode desde string y number', () => {
    const formMock = {
      economicActivity: 'ACT001',
      prospectSector: 'público',
      riskGroup: 'medio',
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('ACT001');
    expect(result.generalData.economicSector).toBe('público');
    expect(result.generalData.riskGroup).toBe('medio');
  });

  it('debe obtener códigos usando propiedad code', () => {
    const formMock = {
      economicActivity: {
        code: 'CODE001',
      },
      prospectSector: {
        code: '13',
      },
      riskGroup: {
        code: '09',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('CODE001');
    expect(result.generalData.economicSector).toBe('13');
    expect(result.generalData.riskGroup).toBe('09');
  });

  it('debe obtener códigos usando propiedad id', () => {
    const formMock = {
      economicActivity: {
        id: 55,
      },
      prospectSector: {
        id: '13',
      },
      riskGroup: {
        id: '05',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe(55);
    expect(result.generalData.economicSector).toBe('13');
    expect(result.generalData.riskGroup).toBe('05');
  });

  it('debe obtener códigos usando propiedad value', () => {
    const formMock = {
      economicActivity: {
        value: 'VALUE001',
      },
      prospectSector: {
        value: '99',
      },
      riskGroup: {
        value: '01',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('VALUE001');
    expect(result.generalData.economicSector).toBe('99');
    expect(result.generalData.riskGroup).toBe('01');
  });

  it('debe obtener códigos usando propiedad key', () => {
    const formMock = {
      economicActivity: {
        key: 'KEY001',
      },
      prospectSector: {
        key: '13',
      },
      riskGroup: {
        key: '09',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('KEY001');
    expect(result.generalData.economicSector).toBe('13');
    expect(result.generalData.riskGroup).toBe('09');
  });

  it('debe retornar null cuando getCode recibe objeto sin propiedades válidas', () => {
    const formMock = {
      economicActivity: {
        name: 'Actividad',
      },
      prospectSector: {
        label: 'privado',
      },
      riskGroup: {
        label: 'alto',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBeNull();
    expect(result.generalData.economicSector).toBeNull();
    expect(result.generalData.riskGroup).toBeNull();
  });

  it('debe mapear prospectSector público y riskGroup alto desde labels', () => {
    const formMock = {
      prospectSector: ' público ',
      riskGroup: ' alto ',
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicSector).toBe(' público ');
    expect(result.generalData.riskGroup).toBe(' alto ');
  });

  it('debe retornar null para labels no reconocidos', () => {
    const formMock = {
      prospectSector: 'desconocido',
      riskGroup: 'sin riesgo',
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicSector).toBe('desconocido');
    expect(result.generalData.riskGroup).toBe('sin riesgo');
  });

  it('debe mapear accountType numérico 1 y 2', () => {
    const result1 = creditDataMapToServicePF({ accountType: 1 }, []);
    const result2 = creditDataMapToServicePF({ accountType: 2 }, []);

    expect(result1.generalData.accountType).toBe('1');
    expect(result2.generalData.accountType).toBe('2');
  });

  it('debe mapear accountType string numérico 1 y 2', () => {
    const result1 = creditDataMapToServicePF({ accountType: '1' }, []);
    const result2 = creditDataMapToServicePF({ accountType: '2' }, []);

    expect(result1.generalData.accountType).toBe('1');
    expect(result2.generalData.accountType).toBe('2');
  });

  it('debe mapear accountType individual a 1', () => {
    const result = creditDataMapToServicePF(
      {
        accountType: ' individual ',
      },
      [],
    );

    expect(result.generalData.accountType).toBe('1');
  });

  it('debe mapear accountType coholders a 2', () => {
    const result = creditDataMapToServicePF(
      {
        accountType: 'coholders',
      },
      [],
    );

    expect(result.generalData.accountType).toBe('2');
  });

  it('debe mapear accountType cotitulares a 2', () => {
    const result = creditDataMapToServicePF(
      {
        accountType: 'cotitulares',
      },
      [],
    );

    expect(result.generalData.accountType).toBe('2');
  });

  it('debe mapear accountType cuenta con cotitulares a 2', () => {
    const result = creditDataMapToServicePF(
      {
        accountType: 'cuenta con cotitulares',
      },
      [],
    );

    expect(result.generalData.accountType).toBe('2');
  });

  it('debe usar accountType 1 cuando accountType es null, undefined, vacío o inválido', () => {
    const resultNull = creditDataMapToServicePF({ accountType: null }, []);
    const resultUndefined = creditDataMapToServicePF(
      { accountType: undefined },
      [],
    );
    const resultEmpty = creditDataMapToServicePF({ accountType: '' }, []);
    const resultInvalid = creditDataMapToServicePF({ accountType: 'otro' }, []);

    expect(resultNull.generalData.accountType).toBe('1');
    expect(resultUndefined.generalData.accountType).toBe('1');
    expect(resultEmpty.generalData.accountType).toBe('1');
    expect(resultInvalid.generalData.accountType).toBe('1');
  });

  it('debe retornar hiringDate null cuando no existe input', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: null,
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBeNull();
  });

  it('debe mantener hiringDate si viene en formato DD/MM/YYYY', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: '15/01/2024',
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBe('15/01/2024');
  });

  it('debe convertir hiringDate desde YYYY-MM-DD a DD/MM/YYYY', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: '2024-01-15',
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBe('15/01/2024');
  });

  it('debe convertir hiringDate desde YYYY/MM/DD a DD/MM/YYYY', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: '2024/02/09',
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBe('09/02/2024');
  });

  it('debe retornar hiringDate null cuando la fecha YYYY-MM-DD tiene valores inválidos en cero', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: '0000-00-00',
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBeNull();
  });

  it('debe convertir hiringDate desde Date válido', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: new Date(2024, 0, 15),
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBe('15/01/2024');
  });

  it('debe retornar hiringDate null cuando Date es inválido', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: new Date('invalid-date'),
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBeNull();
  });

  it('debe convertir hiringDate desde valor parseable por Date', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: 'January 15, 2024',
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBe('15/01/2024');
  });

  it('debe retornar hiringDate null cuando el string no es fecha válida', () => {
    const result = creditDataMapToServicePF(
      {
        hiringDate: 'no-es-fecha',
      },
      [],
    );

    expect(result.employmentData.hiringDate).toBeNull();
  });

  it('debe asignar salaried null cuando no es boolean', () => {
    const resultString = creditDataMapToServicePF({ salaried: 'true' }, []);
    const resultNull = creditDataMapToServicePF({ salaried: null }, []);
    const resultUndefined = creditDataMapToServicePF(
      { salaried: undefined },
      [],
    );

    expect(resultString.employmentData.salaried).toBeNull();
    expect(resultNull.employmentData.salaried).toBeNull();
    expect(resultUndefined.employmentData.salaried).toBeNull();
  });

  it('debe conservar salaried false cuando viene false', () => {
    const result = creditDataMapToServicePF(
      {
        salaried: false,
      },
      [],
    );

    expect(result.employmentData.salaried).toBeFalse();
  });

  it('debe asignar paymentPeriod y paymentCurrencyType en null cuando vienen null o undefined', () => {
    const result = creditDataMapToServicePF(
      {
        paymentPeriod: undefined,
        paymentCurrencyType: null,
      },
      [],
    );

    expect(result.employmentData.paymentPeriod).toBeNull();
    expect(result.employmentData.paymentCurrencyType).toBeNull();
  });

  it('debe limpiar employeeNumber y socialSecurityNumber con trim', () => {
    const result = creditDataMapToServicePF(
      {
        employeeNumber: ' 12345 ',
        socialSecurityNumber: ' NSS123 ',
      },
      [],
    );

    expect(result.employmentData.employeeNumber).toBe('12345');
    expect(result.employmentData.socialSecurityNumber).toBe('NSS123');
  });

  it('debe asignar employeeNumber y socialSecurityNumber null cuando quedan vacíos', () => {
    const result = creditDataMapToServicePF(
      {
        employeeNumber: '   ',
        socialSecurityNumber: '',
      },
      [],
    );

    expect(result.employmentData.employeeNumber).toBeNull();
    expect(result.employmentData.socialSecurityNumber).toBeNull();
  });

  it('debe mapear officers con valores vacíos y nulos', () => {
    const tableMock = [
      {
        firstName: null,
        middleName: undefined,
        firstSurname: '',
        secondSurname: '   ',
        nationality: null,
        currentPosition: undefined,
        positionYears: '',
        industryYears: 'abc',
      },
    ];

    const result = creditDataMapToServicePF({}, tableMock);

    expect(result.officers).toEqual([
      {
        firstName: '',
        middleName: '',
        firstSurname: '',
        secondSurname: '',
        nationality: null,
        currentPosition: '',
        positionYears: null,
        industryYears: null,
      },
    ]);
  });

  it('debe mapear nationality desde lineBusinessId, id, value y key en officers', () => {
    const tableMock = [
      {
        nationality: {
          lineBusinessId: 1,
        },
      },
      {
        nationality: {
          id: 'MX',
        },
      },
      {
        nationality: {
          value: 'US',
        },
      },
      {
        nationality: {
          key: 'CA',
        },
      },
    ];

    const result = creditDataMapToServicePF({}, tableMock);

    expect(result.officers?.[0].nationality).toBe(1);
    expect(result.officers?.[1].nationality).toBe('MX');
    expect(result.officers?.[2].nationality).toBe('US');
    expect(result.officers?.[3].nationality).toBe('CA');
  });

  it('debe mapear múltiples officers correctamente', () => {
    const tableMock = [
      {
        firstName: ' Ana ',
        middleName: ' María ',
        firstSurname: ' Gómez ',
        secondSurname: ' Ruiz ',
        nationality: 'MX',
        currentPosition: ' Gerente ',
        positionYears: 4,
        industryYears: 12,
      },
      {
        firstName: ' Luis ',
        middleName: '',
        firstSurname: ' Hernández ',
        secondSurname: null,
        nationality: 840,
        currentPosition: ' Subdirector ',
        positionYears: '2',
        industryYears: '6',
      },
    ];

    const result = creditDataMapToServicePF({}, tableMock);

    expect(result.officers).toEqual([
      {
        firstName: 'Ana',
        middleName: 'María',
        firstSurname: 'Gómez',
        secondSurname: 'Ruiz',
        nationality: 'MX',
        currentPosition: 'Gerente',
        positionYears: 4,
        industryYears: 12,
      },
      {
        firstName: 'Luis',
        middleName: '',
        firstSurname: 'Hernández',
        secondSurname: '',
        nationality: 840,
        currentPosition: 'Subdirector',
        positionYears: 2,
        industryYears: 6,
      },
    ]);
  });

  it('debe priorizar lineBusinessId sobre code, id, value y key', () => {
    const formMock = {
      economicActivity: {
        lineBusinessId: 'LB',
        code: 'CODE',
        id: 'ID',
        value: 'VALUE',
        key: 'KEY',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('LB');
  });

  it('debe priorizar code sobre id, value y key cuando lineBusinessId es null', () => {
    const formMock = {
      economicActivity: {
        lineBusinessId: null,
        code: 'CODE',
        id: 'ID',
        value: 'VALUE',
        key: 'KEY',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('CODE');
  });

  it('debe priorizar id sobre value y key cuando lineBusinessId y code son null', () => {
    const formMock = {
      economicActivity: {
        lineBusinessId: null,
        code: null,
        id: 'ID',
        value: 'VALUE',
        key: 'KEY',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('ID');
  });

  it('debe priorizar value sobre key cuando los anteriores son null', () => {
    const formMock = {
      economicActivity: {
        lineBusinessId: null,
        code: null,
        id: null,
        value: 'VALUE',
        key: 'KEY',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('VALUE');
  });

  it('debe usar key cuando es la única propiedad válida', () => {
    const formMock = {
      economicActivity: {
        lineBusinessId: null,
        code: null,
        id: null,
        value: null,
        key: 'KEY',
      },
    };

    const result = creditDataMapToServicePF(formMock, []);

    expect(result.generalData.economicActivity).toBe('KEY');
  });
});
