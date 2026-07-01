import { FormControl, FormGroup } from '@angular/forms';
import {
  generalInfoToCheckpoint,
  checkpointToGeneralInfo,
  mapGeneralInfoToForm,
  mapFormToGeneralInfo
} from './customer-general-info.mapper';

describe('General Info Utils', () => {

  const baseGeneralInfo = (overrides?: any) => ({
    personClassification: 'PF',
    economicActivity: 'ACT',
    maritalStatus: 'S',
    marriageType: '',
    sector: 'FIN',
    actinverEmployee: true,
    employeeNumber: '123',
    occupation: 'DEV',
    profession: 'ENG',
    companyName: 'COMP',
    jobTitle: 'DEV',
    companyPhone: '123',
    country: 'MX',
    street: 'Street',
    externalNumber: '1',
    internalNumber: '1',
    postalCode: '20000',
    federalEntityID: 'AGS',
    cityID: 'AGS',
    municipalityID: 'AGS',
    federalEntity: 'AGS',
    city: 'AGS',
    municipality: 'AGS',
    website: 'web',
    related: true,
    relationship: 'FAMILY',
    institutionName: 'INST',
    fiel: 'YES',
    fielExpirationDate: '2024-01-01',
    domicilieType: 'HOME',
    colony: 'COL',
    otherAddress: 'OTHER',
    ...overrides
  });

  describe('generalInfoToCheckpoint', () => {

    it('mapea correctamente datos básicos', () => {
      const result = generalInfoToCheckpoint(baseGeneralInfo());

      expect(result.personClassification).toBe('PF');
      expect(result.companyName).toBe('COMP');
    });

    it('usa marriageType default si vacío', () => {
      const result = generalInfoToCheckpoint(baseGeneralInfo({ marriageType: '' }));

      expect(result.marriageType).toBe('0');
    });

    it('usa IDs cuando country es MX', () => {
      const result = generalInfoToCheckpoint(baseGeneralInfo());

      expect(result.federalEntity).toBe('AGS');
      expect(result.city).toBe('AGS');
    });

    it('usa texto cuando no es MX', () => {
      const result = generalInfoToCheckpoint(
        baseGeneralInfo({
          country: 'US',
          federalEntity: 'TX',
          city: 'Dallas'
        })
      );

      expect(result.federalEntity).toBe('TX');
      expect(result.city).toBe('Dallas');
    });

    it('maneja fielExpirationDate', () => {
      const result = generalInfoToCheckpoint(baseGeneralInfo());

      expect(result.fielExpirationDate).toBeTruthy();
    });

    it('relationship vacío si related false', () => {
      const result = generalInfoToCheckpoint(
        baseGeneralInfo({ related: false })
      );

      expect(result.relationship).toBe('');
      expect(result.institutionName).toBe('');
    });

  });

  describe('checkpointToGeneralInfo', () => {

    it('reconstruye datos correctamente', () => {
      const input = generalInfoToCheckpoint(baseGeneralInfo());

      const result = checkpointToGeneralInfo(input);

      expect(result.personClassification).toBe('PF');
      expect(result.companyName).toBe('COMP');
    });

    it('usa IDs cuando MX', () => {
      const input = generalInfoToCheckpoint(baseGeneralInfo());

      const result = checkpointToGeneralInfo(input);

      expect(result.federalEntityID).toBe('AGS');
      expect(result.cityID).toBe('AGS');
    });

    it('usa texto cuando no MX', () => {
      const input = generalInfoToCheckpoint(
        baseGeneralInfo({ country: 'US' })
      );

      const result = checkpointToGeneralInfo(input);

      expect(result.federalEntity).toBeTruthy();
    });

  });

  describe('mapGeneralInfoToForm', () => {

    it('mapea correctamente campos al form', () => {
      const result = mapGeneralInfoToForm(baseGeneralInfo());

      expect(result.personClasification).toBe('PF');
      expect(result.company).toBe('COMP');
      expect(result.relationship).toBe('FAMILY');
    });

  });

  describe('mapFormToGeneralInfo', () => {

    const buildForm = () =>
      new FormGroup({
        personClasification: new FormControl('PF'),
        economicActivity: new FormControl('ACT'),
        civilStatus: new FormControl('S'),
        maritalType: new FormControl('1'),
        sector: new FormControl('FIN'),
        actinverEmployee: new FormControl(true),
        actinverEmployeeNumber: new FormControl('123'),
        ocupation: new FormControl('DEV'),
        profession: new FormControl('ENG'),
        company: new FormControl('COMP'),
        charge: new FormControl('DEV'),
        phoneCompany: new FormControl('123'),
        webPage: new FormControl('web'),
        isParentOfEmployee: new FormControl(true),
        relationship: new FormControl('FAMILY'),
        institutionDenomination: new FormControl('INST'),
        fiel: new FormControl('YES'),
        expirationFiel: new FormControl('2024-01-01')
      });

    const address = {
      addressType: 'HOME',
      other: 'OTHER',
      country: 'MX',
      postalCode: '20000',
      federalEntity: 'AGS',
      federalEntityID: 'AGS',
      city: 'AGS',
      cityID: 'AGS',
      municipality: 'AGS',
      municipalityID: 'AGS',
      neighborhood: 'COL',
      street: 'Street',
      externalNumber: '1',
      internalNumber: '1'
    } as any;

    it('mapea correctamente form + address', () => {
      const form = buildForm();

      const result = mapFormToGeneralInfo(form, address);

      expect(result.personClassification).toBe('PF');
      expect(result.companyName).toBe('COMP');
      expect(result.country).toBe('MX');
    });

    it('convierte strings vacíos a null', () => {
      const form = buildForm();
      form.patchValue({ company: '' });

      const result = mapFormToGeneralInfo(form, address);

      expect(result.companyName).toBeNull();
    });

    it('maneja address null', () => {
      const form = buildForm();

      const result = mapFormToGeneralInfo(form, null);

      expect(result.country).toBeNull();
      expect(result.street).toBeNull();
    });

  });

});