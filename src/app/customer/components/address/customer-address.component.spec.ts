//  import { TestBed, ComponentFixture } from '@angular/core/testing';
//  import { CustomerAddressComponent } from './address.component';
//  import { CustomerAddressSectionComponent } from '../../../../../../../../../../../../components/sections/address-section/address-section.component';
//  import { CustomerFirstDataClientService } from '../../services/storage-services/customer-first-data-client.service';
//  import { CustomerCatalogsService } from '../../services/customer-catalogs.service';
//  import { CustomerAddressService } from '../../services/storage-services/customer-address.service';
//  import { CustomerAddressesService } from '../../services/storage-services/customer-addresses.service';
//  import { CustomerNotificationsService } from '../../services/customer-notifications.service';
//  import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
//  import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
//  import { CustomerZipCodeService } from '../../services/customer-zip-code.service';
//  import { HttpClientModule } from '@angular/common/http';
//  import { of } from 'rxjs';
//  import { MatFormFieldModule } from '@angular/material/form-field';
//  import { MatInputModule } from '@angular/material/input';
//  import { CustomerTableResultsComponent } from '../../../shared/components/table-results/table-results.component';
//  import { MatSelectModule } from '@angular/material/select';
//  import { FormGroup, ReactiveFormsModule } from '@angular/forms';
//  import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
//  import { MatTableModule } from '@angular/material/table';

//  const mockFirstDataClientService = {
//    getItem: () => ({ /* mock data client */ })
//  };

//  const mockCatalogsService = {
//    getCatalog: (type: string) => of([
//      { addressTypeId: '1', addressType: 'Fiscal' },
//      { addressTypeId: '2', addressType: 'CustomerResidencia' },
//      { proofAddressId: '1', proofAddress: 'Utility Bill' }
//    ])
//  };

//  const mockAddressService = {
//    add: () => true,
//    getAll: () => [{ addressType: 'Fiscal', proofOfAddressType: 'Utility Bill' }],
//    update: () => true,
//    delete: () => true
//  };

//  const mockAddressesService = {
//    get: () => ({ addressList: [{ addressType: 'Fiscal', proofOfAddressType: 'Utility Bill' }] }),
//    set: () => { }
//  };

//  const mockNotificationsService = {
//    success: (title: string, message: string) => console.log(title, message),
//    error: (message: string) => console.error(message)
//  };

//  const mockUnsavedChangesService = {
//    setUnsavedChanges: (status: boolean) => console.log('Unsaved changes:', status)
//  };

//  const mockNotificationModalService = {
//    confirm: () => Promise.resolve({ value: true })
//  };

//  describe('CustomerAddressComponent', () => {
//    let component: CustomerAddressComponent;
//    let fixture: ComponentFixture<CustomerAddressComponent>;

//    beforeEach(async () => {
//      await TestBed.configureTestingModule({
//        declarations: [CustomerAddressComponent, CustomerAddressSectionComponent, CustomerTableResultsComponent],
//        imports: [
//          HttpClientModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatRadioGroup, MatRadioButton, MatTableModule


//        ],
//        providers: [
//          { provide: CustomerFirstDataClientService, useValue: mockFirstDataClientService },
//          { provide: CustomerCatalogsService, useValue: mockCatalogsService },
//          { provide: CustomerAddressService, useValue: mockAddressService },
//          { provide: CustomerAddressesService, useValue: mockAddressesService },
//          { provide: CustomerNotificationsService, useValue: mockNotificationsService },
//          { provide: UnsavedChangesService, useValue: mockUnsavedChangesService },
//          { provide: CustomerNotificationModalService, useValue: mockNotificationModalService },
//          CustomerZipCodeService,
//        ]
//      }).compileComponents();

//      fixture = TestBed.createComponent(CustomerAddressComponent);
//      component = fixture.componentInstance;
//      fixture.detectChanges();
//    });

//    it('should create the component', () => {
//      expect(component).toBeTruthy();
//    });
//    describe('searchIdByAddressTypeName', () => {
//      it('should return the correct address type id for a given name', () => {
//        component.domicileTypes.set([
//          { addressTypeId: '1', addressType: 'Fiscal' },
//          { addressTypeId: '2', addressType: 'CustomerResidencia' }
//        ]);

//        expect(component.searchIdByAddressTypeName('Fiscal')).toBe('1');
//        expect(component.searchIdByAddressTypeName('CustomerResidencia')).toBe('2');
//        expect(component.searchIdByAddressTypeName('NonExistent')).toBe('');
//      });
//    });

//    describe('searchIdByProofOfAddressTypeName', () => {
//      it('should return the correct proof of address type id for a given name', () => {
//        component.domiliceProof.set([
//          {
//            proofAddressId: '1', proofAddress: 'Utility Bill',
//            personTyipeId: ''
//          },
//          {
//            proofAddressId: '2', proofAddress: 'CustomerBank Statement',
//            personTyipeId: ''
//          }
//        ]);

//        expect(component.searchIdByProofOfAddressTypeName('Utility Bill')).toBe('1');
//        expect(component.searchIdByProofOfAddressTypeName('CustomerBank Statement')).toBe('2');
//        expect(component.searchIdByProofOfAddressTypeName('NonExistent')).toBe('');
//      });
//    });

//    describe('addAddress', () => {
//      it('should add a new address successfully', async () => {
//        spyOn(component.addressSectionComponent, 'onSubmit').and.returnValue(Promise.resolve({
//          addressRole: "",
//          addressType: "",
//          other: "",
//          country: "",
//          postalCode: "",
//          federalEntity: "",
//          city: "",
//          municipality: "",
//          neighborhood: "",
//          street: "",
//          externalNumber: "",
//          internalNumber: "",
//          confirmCp: "",
//          timeLiveMexico: "",
//          reasonsOpeningContractMexico: "",
//          proofOfAddressType: "",
//          addressProofIssueDate: "",
//          expirationYear: "",
//          taxPostalCode: "",
//          geographicalArea: "",
//          deliveryCenter: "",
//        }));
//        spyOn(component.addressService, 'add').and.returnValue(true);
//        spyOn(component.notificationService, 'success');
//        spyOn(component.unsavedChangesService, 'setUnsavedChanges');

//        await component.addAddress();

//        expect(component.addressService.add).toHaveBeenCalled();
//        expect(component.notificationService.success).toHaveBeenCalledWith('¡Registro de domicilio exitoso!', 'Se ha agregado correctamente');
//        expect(component.unsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
//      });

//      it('should handle error when adding address fails', async () => {
//        spyOn(component.addressSectionComponent, 'onSubmit').and.returnValue(Promise.resolve({
//          addressRole: "",
//          addressType: "",
//          other: "",
//          country: "",
//          postalCode: "",
//          federalEntity: "",
//          city: "",
//          municipality: "",
//          neighborhood: "",
//          street: "",
//          externalNumber: "",
//          internalNumber: "",
//          confirmCp: "",
//          timeLiveMexico: "",
//          reasonsOpeningContractMexico: "",
//          proofOfAddressType: "",
//          addressProofIssueDate: "",
//          expirationYear: "",
//          taxPostalCode: "",
//          geographicalArea: "",
//          deliveryCenter: "",
//        }));
//        spyOn(component.addressService, 'add').and.returnValue(false);
//        spyOn(component.notificationService, 'error');

//        await component.addAddress();

//        expect(component.notificationService.error).toHaveBeenCalledWith('Error al Guardar');
//      });
//    });

//    describe('save', () => {
//      it('should save addresses successfully', () => {
//        spyOn(component.addressService, 'getAll').and.returnValue([{
//          addressType: 'Fiscal', proofOfAddressType: 'Utility Bill',
//          country: '',
//          postalCode: '',
//          federalEntity: '',
//          city: '',
//          municipality: '',
//          neighborhood: '',
//          street: '',
//          externalNumber: ''
//        }]);
//        spyOn(component.addressesService, 'set');
//        spyOn(component.notificationService, 'success');
//        spyOn(component.unsavedChangesService, 'setUnsavedChanges');

//        component.save();

//        expect(component.addressesService.set).toHaveBeenCalled();
//        expect(component.notificationService.success).toHaveBeenCalledWith('¡Registro de domicilios exitoso!', 'Se han agregado correctamente');
//        expect(component.unsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(false);
//      });

//      it('should handle error when no addresses are saved', () => {
//        spyOn(component.addressService, 'getAll').and.returnValue([]);
//        spyOn(component.notificationService, 'error');

//        component.save();

//        expect(component.notificationService.error).toHaveBeenCalledWith('Debe haber al menos un domicilio registrado.');
//      });
//    });

//    describe('eventRow', () => {
//      it('should edit an address', async () => {
//        const mockEvent = { type: 'edit', row: { addressRole: 'FISCAL', addressType: 'Fiscal', proofOfAddressType: 'Utility Bill' } };
//        spyOn(component.unsavedChangesService, 'setUnsavedChanges');
//        spyOn(component.addressSectionComponent, 'setAddresData');

//        await component.eventRow(mockEvent);

//        expect(component.unsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
//        expect(component.addressSectionComponent.setAddresData).toHaveBeenCalled();
//      });

//      it('should delete an address', async () => {
//        const mockEvent = { type: 'delete', row: { addressRole: 'FISCAL', addressType: 'Fiscal', proofOfAddressType: 'Utility Bill' } };
//        spyOn(component.notificationModalService, 'confirm').and.returnValue(Promise.resolve({ value: true }));
//        spyOn(component.addressService, 'delete');
//        spyOn(component.notificationService, 'success');

//        component.dataAddres = [{
//          addressRole: 'FISCAL', addressType: 'Fiscal', proofOfAddressType: 'Utility Bill',
//          country: '',
//          postalCode: '',
//          federalEntity: '',
//          city: '',
//          municipality: '',
//          neighborhood: '',
//          street: '',
//          externalNumber: ''
//        }, {
//          addressRole: 'CustomerRESIDENCIA', addressType: 'CustomerResidencia', proofOfAddressType: 'CustomerBank Statement',
//          country: '',
//          postalCode: '',
//          federalEntity: '',
//          city: '',
//          municipality: '',
//          neighborhood: '',
//          street: '',
//          externalNumber: ''
//        }];

//        await component.eventRow(mockEvent);

//        expect(component.addressService.delete).toHaveBeenCalledWith('FISCAL');
//        expect(component.notificationService.success).toHaveBeenCalledWith('¡Domicilio Eliminado con Éxito!', 'Se eliminó el registro de domicilio.');
//      });

//      it('should handle error when trying to delete the last address', async () => {
//        const mockEvent = { type: 'delete', row: { addressRole: 'FISCAL', addressType: 'Fiscal', proofOfAddressType: 'Utility Bill' } };
//        spyOn(component.notificationService, 'error');

//        component.dataAddres = [{
//          addressRole: 'FISCAL', addressType: 'Fiscal', proofOfAddressType: 'Utility Bill',
//          country: '',
//          postalCode: '',
//          federalEntity: '',
//          city: '',
//          municipality: '',
//          neighborhood: '',
//          street: '',
//          externalNumber: ''
//        }];

//        await component.eventRow(mockEvent);

//        expect(component.notificationService.error).toHaveBeenCalledWith('Debe haber al menos un domicilio registrado.');
//      });
//    });


//   it('should successfully update an existing address', async () => {
//      component.address = {
//        addressRole: 'FISCAL',
//        addressType: 'Fiscal',
//        postalCode: '12345',
//        proofOfAddressType: 'Utility Bill',
//        country: 'CountryName',
//        federalEntity: 'FederalEntityName',
//        city: 'CityName',
//        municipality: 'MunicipalityName',
//        neighborhood: 'NeighborhoodName',
//        street: 'StreetName',
//        externalNumber: '123',
//        internalNumber: '456',
//        confirmCp: '12345',
//        timeLiveMexico: '5 years',
//        reasonsOpeningContractMexico: 'Business',
//        addressProofIssueDate: '01/01/2022',
//        expirationYear: '2025',
//        taxPostalCode: '12345',
//        geographicalArea: 'Urban',
//        deliveryCenter: 'CenterName',
//        other: 'OtherDetails'
//      };


//      spyOn(component.addressSectionComponent, 'onSubmit').and.returnValue(Promise.resolve({
//        addressRole: "",
//        addressType: "",
//        other: "",
//        country: "",
//        postalCode: "",
//        federalEntity: "",
//        city: "",
//        municipality: "",
//        neighborhood: "",
//        street: "",
//        externalNumber: "",
//        internalNumber: "",
//        confirmCp: "",
//        timeLiveMexico: "",
//        reasonsOpeningContractMexico: "",
//        proofOfAddressType: "",
//        addressProofIssueDate: "",
//        expirationYear: "",
//        taxPostalCode: "",
//        geographicalArea: "",
//        deliveryCenter: "",
//      }));


//      spyOn(component['addressService'], 'update').and.returnValue(true);
//      spyOn(component['addressService'], 'getAll').and.returnValue([{
//        addressRole: "",
//        addressType: "",
//        other: "",
//        country: "",
//        postalCode: "",
//        federalEntity: "",
//        city: "",
//        municipality: "",
//        neighborhood: "",
//        street: "",
//        externalNumber: "",
//        internalNumber: "",
//        confirmCp: "",
//        timeLiveMexico: "",
//        reasonsOpeningContractMexico: "",
//        proofOfAddressType: "",
//        addressProofIssueDate: "",
//        expirationYear: "",
//        taxPostalCode: "",
//        geographicalArea: "",
//        deliveryCenter: "",
//      }]);

//      spyOn(component['notificationService'], 'success');
//      spyOn(component['unsavedChangesService'], 'setUnsavedChanges');

//      await component.addAddress();

//      expect(component['addressService'].update).toHaveBeenCalledWith('FISCAL', jasmine.any(Object));
//      expect(component['notificationService'].success).toHaveBeenCalledWith('¡Registro de domicilio exitoso!', 'Se ha agregado correctamente');
//      expect(component['unsavedChangesService'].setUnsavedChanges).toHaveBeenCalledWith(true);
//      expect(component.address).toBeNull();
//    });
//  });











