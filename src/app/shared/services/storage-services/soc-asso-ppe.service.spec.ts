import { SocAssoPPEService } from "./soc-asso-ppe.service";
import { DataClientSocAndAssoPPE } from '../../../onboarding/models/client-data';


describe('SocAssoPPEService', () => {
  let service: SocAssoPPEService;

  beforeEach(() => {
    service = new SocAssoPPEService();
  });

  it('should add a new object correctly', () => {
    const data: DataClientSocAndAssoPPE = {
      rfc: '123',
      companyName: "",
      commercialBusiness: "",
      administratorManagerAttorney: "",
      phone: "",
      economicActivity: "",
      nationality: "",
      addressType: "",
      country: "",
      postalCode: "",
      federalEntity: "",
      city: "",
      municipality: "",
      neighborhood: "",
      street: "",
      externalNumber: ""
    };
    const result = service.add(data);
    expect(result).toBeTrue();
    expect(service.getAll()).toContain(data);
  });

  it('should not add a duplicate object', () => {
    const data: DataClientSocAndAssoPPE = {
      rfc: '123',
      companyName: "",
      commercialBusiness: "",
      administratorManagerAttorney: "",
      phone: "",
      economicActivity: "",
      nationality: "",
      addressType: "",
      country: "",
      postalCode: "",
      federalEntity: "",
      city: "",
      municipality: "",
      neighborhood: "",
      street: "",
      externalNumber: ""
    };
    service.add(data);
    const result = service.add(data);
    expect(result).toBeFalse();
    expect(service.getAll().length).toBe(1);
  });

  it('should add a list of objects', () => {
    const dataList: DataClientSocAndAssoPPE[] = [
      {
        rfc: '123',
        companyName: "",
        commercialBusiness: "",
        administratorManagerAttorney: "",
        phone: "",
        economicActivity: "",
        nationality: "",
        addressType: "",
        country: "",
        postalCode: "",
        federalEntity: "",
        city: "",
        municipality: "",
        neighborhood: "",
        street: "",
        externalNumber: ""
      },
      {
        rfc: '456',
        companyName: "",
        commercialBusiness: "",
        administratorManagerAttorney: "",
        phone: "",
        economicActivity: "",
        nationality: "",
        addressType: "",
        country: "",
        postalCode: "",
        federalEntity: "",
        city: "",
        municipality: "",
        neighborhood: "",
        street: "",
        externalNumber: ""
      }
    ];
    service.addList(dataList);
    expect(service.getAll()).toEqual(dataList);
  });

  it('should update an existing object', () => {
    const data: DataClientSocAndAssoPPE = {
      rfc: '123',
      companyName: "",
      commercialBusiness: "",
      administratorManagerAttorney: "",
      phone: "",
      economicActivity: "",
      nationality: "",
      addressType: "",
      country: "",
      postalCode: "",
      federalEntity: "",
      city: "",
      municipality: "",
      neighborhood: "",
      street: "",
      externalNumber: ""
    };
    const updatedData: DataClientSocAndAssoPPE = {
      rfc: '123',
      companyName: "",
      commercialBusiness: "",
      administratorManagerAttorney: "",
      phone: "",
      economicActivity: "",
      nationality: "",
      addressType: "",
      country: "",
      postalCode: "",
      federalEntity: "",
      city: "",
      municipality: "",
      neighborhood: "",
      street: "",
      externalNumber: ""
    };
    service.add(data);
    const result = service.update('123', updatedData);
    expect(result).toBeTrue();
    expect(service.getAll()).toContain(updatedData);
  });

  it('should not update a non-existing object', () => {
    const updatedData: DataClientSocAndAssoPPE = {
      rfc: '123',
      companyName: "",
      commercialBusiness: "",
      administratorManagerAttorney: "",
      phone: "",
      economicActivity: "",
      nationality: "",
      addressType: "",
      country: "",
      postalCode: "",
      federalEntity: "",
      city: "",
      municipality: "",
      neighborhood: "",
      street: "",
      externalNumber: ""
    };
    const result = service.update('123', updatedData);
    expect(result).toBeFalse();
  });

  it('should delete an existing object', () => {
    const data: DataClientSocAndAssoPPE = {
      rfc: '123',
      companyName: "",
      commercialBusiness: "",
      administratorManagerAttorney: "",
      phone: "",
      economicActivity: "",
      nationality: "",
      addressType: "",
      country: "",
      postalCode: "",
      federalEntity: "",
      city: "",
      municipality: "",
      neighborhood: "",
      street: "",
      externalNumber: ""
    };
    service.add(data);
    const result = service.delete('123');
    expect(result).toBeTrue();
    expect(service.getAll()).not.toContain(data);
  });

  it('should not delete a non-existing object', () => {
    const result = service.delete('123');
    expect(result).toBeFalse();
  });

  it('should clear all objects', () => {
    const data: DataClientSocAndAssoPPE = {
      rfc: '123',
      companyName: "",
      commercialBusiness: "",
      administratorManagerAttorney: "",
      phone: "",
      economicActivity: "",
      nationality: "",
      addressType: "",
      country: "",
      postalCode: "",
      federalEntity: "",
      city: "",
      municipality: "",
      neighborhood: "",
      street: "",
      externalNumber: ""
    };
    service.add(data);
    const result = service.clear();
    expect(result).toBeTrue();
    expect(service.getAll()).toEqual([]);
  });
});
