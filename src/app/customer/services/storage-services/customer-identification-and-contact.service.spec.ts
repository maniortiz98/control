import { TestBed } from '@angular/core/testing';
import { CustomerIdentificationAndContactService } from './customer-identification-and-contact.service';

describe('CustomerIdentificationAndContactService', () => {

  let service: CustomerIdentificationAndContactService;

  const buildIdentification = (overrides?: any) => ({
    name: 'Test',
    ...overrides
  });

  const buildContactPm = (overrides?: any) => ({
    phone: '123',
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerIdentificationAndContactService]
    });

    service = TestBed.inject(CustomerIdentificationAndContactService);
  });

  it('ids deben existir', () => {
    expect(typeof service.id).toBe('string');
    expect(typeof service.otherId).toBe('string');
    expect(service.id).not.toEqual(service.otherId);
  });

  describe('identificationAndContactInfo signal', () => {

    it('estado inicial es null', () => {
      spyOn(console, 'log');
      expect(service.getIdentificationAndContactInfo()).toBeNull();
    });

    it('setIdentificationAndContactInfo actualiza valor', () => {
      spyOn(console, 'log');

      const data = buildIdentification();

      service.setIdentificationAndContactInfo(data);

      expect(service.getIdentificationAndContactInfo()).toEqual(data);
      expect(console.log).toHaveBeenCalledWith('seteando');
    });

    it('getter expone readonly signal', () => {
      const signal = service.identificationAndContactInfo;

      expect(typeof signal).toBe('function');
      expect(signal()).toBeNull();
    });

    it('cleartIdentificationAndContactInfo limpia datos', () => {
      service.setIdentificationAndContactInfo(buildIdentification());

      service.cleartIdentificationAndContactInfo();

      expect(service.getIdentificationAndContactInfo()).toBeNull();
    });

    it('getter hace log', () => {
      const spy = spyOn(console, 'log');

      service.identificationAndContactInfo();

      expect(spy).toHaveBeenCalledWith('consultando');
    });

  });

  describe('contactSignalPm', () => {

    it('estado inicial es null', () => {
      expect(service.getContactInfo()).toBeNull();
    });

    it('setContactInfoPm actualiza valor', () => {
      const data = buildContactPm();

      service.setContactInfoPm(data);

      expect(service.getContactInfo()).toEqual(data);
    });

    it('getter readonly signal funciona', () => {
      const signal = service.contactInfoPm;

      expect(typeof signal).toBe('function');
      expect(signal()).toBeNull();
    });

  });

});
