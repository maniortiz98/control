/* import { mapToCheckPointFiscalSelfDeclarationData } from './maper';
import { FiscalSelfDeclaration } from '../../../onboarding/models/checkpoints/fiscal-self-declaration-checkpoint';

function buildResidence(overrides: Partial<any> = {}): any {
  return {
    personType: 'TITULAR',
    country: 'US',
    declarationFiscalResidence: true,
    proofOfAddressType: 'CONSTANCIA DE RESIDENCIA FISCAL',
    issueDate: '2025-06-15T00:00:00.000Z',
    expirationStatus: 'VIGENTE',
    expirationDate: '2026-06-15T00:00:00.000Z',
    certificationDate: '2025-06-15T00:00:00.000Z',
    declarationYear: 2025,
    aditionalDays: '30',
    factaObligations: {
      autentication: 'ID FISCAL EXTRANJERO (NIF / TIN / NSS)',
      nif: '123',
      tin: '456',
      nss: '789',
    },
    ...overrides,
  };
}

function buildForm(overrides: Partial<FiscalSelfDeclaration> = {}): FiscalSelfDeclaration {
  return {
    mexicoResident: true,
    curp: 'GARC850101HDFRRL09',
    foreignerWithoutCurp: false,
    rfc: 'GARC850101AAA',
    name: 'JUAN GARCIA',
    fiscalRegimeId: 601,
    cfdiUse: 'G03',
    taxPostalCode: '06600',
    nationality: 'MX',
    country: 'MX',
    fiscalResidenceAbroad: false,
    facta: true,
    crs: false,
    fiscalResidences: [
      buildResidence({ activeFiscalDomicilie: true }),
    ],
    ...overrides,
  };
}

describe('mapToCheckPointFiscalSelfDeclarationData', () => {

  it('should throw error when no active fiscal residence exists', () => {
    const form = buildForm({
      fiscalResidences: [
        buildResidence({ activeFiscalDomicilie: false }),
      ],
    });

    expect(() => mapToCheckPointFiscalSelfDeclarationData(form))
      .toThrowError('No active fiscal residence found.');
  });

  it('should normalize mexicoResident string "true" to boolean true', () => {
    const form = buildForm({ mexicoResident: 'true' as any });
    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.mexicoResident).toBe(true);
  });

  it('should normalize mexicoResident string "false" to boolean false', () => {
    const form = buildForm({ mexicoResident: 'false' as any });
    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.mexicoResident).toBe(false);
  });

  it('should normalize fiscalResidenceAbroad string to boolean', () => {
    const form = buildForm({ fiscalResidenceAbroad: 'true' as any });
    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.fiscalResidenceAbroad).toBe(true);
  });

  it('should normalize facta and crs to booleans', () => {
    const form = buildForm({ facta: 'true' as any, crs: 'false' as any });
    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.facta).toBe(true);
    expect(result.crs).toBe(false);
  });

  it('should preserve ALL fiscal residences, not just the active one', () => {
    const form = buildForm({
      fiscalResidences: [
        buildResidence({ country: 'US', activeFiscalDomicilie: false }),
        buildResidence({ country: 'MX', activeFiscalDomicilie: true }),
        buildResidence({ country: 'CA', activeFiscalDomicilie: false }),
      ],
    });

    const result = mapToCheckPointFiscalSelfDeclarationData(form);

    expect(result.fiscalResidences.length).toBe(3);
    expect(result.fiscalResidences[0].country).toBe('US');
    expect(result.fiscalResidences[0].activeFiscalDomicilie).toBe(false);
    expect(result.fiscalResidences[1].country).toBe('MX');
    expect(result.fiscalResidences[1].activeFiscalDomicilie).toBe(true);
    expect(result.fiscalResidences[2].country).toBe('CA');
    expect(result.fiscalResidences[2].activeFiscalDomicilie).toBe(false);
  });

  it('should map personType TITULAR to 1 and COTITULAR to 2', () => {
    const form = buildForm({
      fiscalResidences: [
        buildResidence({ personType: 'TITULAR', activeFiscalDomicilie: true }),
        buildResidence({ personType: 'COTITULAR', activeFiscalDomicilie: false }),
      ],
    });

    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.fiscalResidences[0].personType).toBe(1);
    expect(result.fiscalResidences[1].personType).toBe(2);
  });

  it('should format dates to DD/MM/YYYY', () => {
    const form = buildForm({
      fiscalResidences: [
        buildResidence({
          issueDate: '2025-06-15T00:00:00.000Z',
          activeFiscalDomicilie: true,
        }),
      ],
    });

    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.fiscalResidences[0].issueDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('should map proofOfAddressType to code', () => {
    const form = buildForm({
      fiscalResidences: [
        buildResidence({
          proofOfAddressType: 'CONSTANCIA DE RESIDENCIA FISCAL',
          activeFiscalDomicilie: true,
        }),
      ],
    });

    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.fiscalResidences[0].proofOfAddressType).toBe('XX03');
  });

  it('should map autentication type to code', () => {
    const form = buildForm({
      fiscalResidences: [
        buildResidence({
          factaObligations: {
            autentication: 'ID FISCAL EXTRANJERO (NIF / TIN / NSS)',
            nif: '1', tin: '2', nss: '3',
          },
          activeFiscalDomicilie: true,
        }),
      ],
    });

    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.fiscalResidences[0].factaObligations.autentication).toBe('US01');
  });

  it('should preserve scalar fields correctly', () => {
    const form = buildForm();
    const result = mapToCheckPointFiscalSelfDeclarationData(form);

    expect(result.curp).toBe('GARC850101HDFRRL09');
    expect(result.rfc).toBe('GARC850101AAA');
    expect(result.name).toBe('JUAN GARCIA');
    expect(result.fiscalRegimeId).toBe(601);
    expect(result.cfdiUse).toBe('G03');
    expect(result.taxPostalCode).toBe('06600');
    expect(result.nationality).toBe('MX');
    expect(result.country).toBe('MX');
  });

  it('should handle a single active residence correctly', () => {
    const form = buildForm({
      fiscalResidences: [
        buildResidence({ activeFiscalDomicilie: true }),
      ],
    });

    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.fiscalResidences.length).toBe(1);
    expect(result.fiscalResidences[0].activeFiscalDomicilie).toBe(true);
  });

  it('should handle missing optional fields gracefully', () => {
    const form = buildForm({
      mexicoResident: false,
      curp: '',
      foreignerWithoutCurp: true,
      rfc: '',
      name: '',
      fiscalRegimeId: 0,
      cfdiUse: '',
      taxPostalCode: '',
      nationality: '',
      country: '',
      fiscalResidenceAbroad: false,
      facta: false,
      crs: false,
      fiscalResidences: [
        buildResidence({
          personType: 1,
          country: '',
          declarationFiscalResidence: false,
          proofOfAddressType: '',
          issueDate: '',
          expirationStatus: '',
          expirationDate: '',
          certificationDate: '',
          declarationYear: 0,
          aditionalDays: '',
          factaObligations: {},
          activeFiscalDomicilie: true,
        }),
      ],
    });

    const result = mapToCheckPointFiscalSelfDeclarationData(form);
    expect(result.fiscalResidences.length).toBe(1);
    expect(result.fiscalResidences[0].factaObligations.nif).toBe('');
    expect(result.fiscalResidences[0].factaObligations.tin).toBe('');
    expect(result.fiscalResidences[0].factaObligations.nss).toBe('');
  });
});
 */