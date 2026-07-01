import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ModalFormService, Maintenance } from './modal-form.service';
import { ModalFormComponent } from '../components/modals/modal-form/modal-form.component';

describe('ModalFormService', () => {
  let service: ModalFormService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  const maintenanceMock: Maintenance = {
    all: false,
    edit: false,
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ModalFormService,
        { provide: MatDialog, useValue: spy },
      ],
    });

    service = TestBed.inject(ModalFormService);
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('formModalDataPPE should open modal with correct config and data', (done) => {
    const dataClientMock = { id: 1, name: 'Client PPE' } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(dataClientMock),
    } as any);

    service.formModalDataPPE(maintenanceMock, dataClientMock).subscribe(result => {
      expect(result).toEqual(dataClientMock);
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalFormComponent,
      jasmine.objectContaining({
        autoFocus: false,
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '80vh',
        maxWidth: '80vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border',
        data: {
          type: 'ppe',
          dataClient: dataClientMock,
          dataConfigAdministratorExercisingPfControl: undefined,
          isMaintenance: maintenanceMock,
          minFiscalData: undefined,
          isCotitular: undefined,
        },
      })
    );
  });

  it('formModalDataDepPPE should open modal with type ppeDep', (done) => {
    const dataClientMock = { id: 2, name: 'Client Dep' } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(null),
    } as any);

    service.formModalDataDepPPE(maintenanceMock, dataClientMock).subscribe(result => {
      expect(result).toBeNull();
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalFormComponent,
      jasmine.objectContaining({
        data: {
          type: 'ppeDep',
          dataClient: dataClientMock,
          dataConfigAdministratorExercisingPfControl: undefined,
          isMaintenance: maintenanceMock,
          minFiscalData: undefined,
          isCotitular: undefined,
        },
      })
    );
  });

  it('formModalDataAsoPPE should open modal with type ppeAep', (done) => {
    const dataClientMock = { id: 3, name: 'Client Aso' } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(null),
    } as any);

    service.formModalDataAsoPPE(maintenanceMock, dataClientMock).subscribe(result => {
      expect(result).toBe(null);
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalFormComponent,
      jasmine.objectContaining({
        data: {
          type: 'ppeAep',
          dataClient: dataClientMock,
          dataConfigAdministratorExercisingPfControl: undefined,
          isMaintenance: maintenanceMock,
          minFiscalData: undefined,
          isCotitular: undefined,
        },
      })
    );
  });

  it('homonimiaModal should open modal with type homonimia', (done) => {
    const homonymsMock = [{ id: 1, name: 'Homonym' }] as any[];

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(homonymsMock),
    } as any);

    service.homonimiaModal(homonymsMock).subscribe(result => {
      expect(result).toEqual(homonymsMock);
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalFormComponent,
      jasmine.objectContaining({
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '80vh',
        maxWidth: '80vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border',
        data: {
          type: 'homonimia',
          dataClient: homonymsMock,
          dataConfigAdministratorExercisingPfControl: undefined,
          isMaintenance: maintenanceMock,
          minFiscalData: undefined,
          isCotitular: undefined,
        },
      })
    );
  });

  it('fiscalResidenceModal should open modal with type fiscalResidence', (done) => {
    const fiscalDataMock = { id: 10 } as any;
    const adminConfigMock = { foo: 'bar' } as any;
    const minFiscalDataMock = { min: 1 } as any;
     const expectedResult = { result: true } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of({ result: true }),
    } as any);

    service.fiscalResidenceModal(
      fiscalDataMock,
      adminConfigMock,
      minFiscalDataMock,
      true
    ).subscribe(result => {
      expect(result).toEqual(expectedResult);
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalFormComponent,
      jasmine.objectContaining({
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '80vh',
        maxWidth: '80vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border',
        data: {
          type: 'fiscalResidence',
          dataClient: fiscalDataMock,
          dataConfigAdministratorExercisingPfControl: adminConfigMock,
          isMaintenance: maintenanceMock,
          minFiscalData: minFiscalDataMock,
          isCotitular: true,
        },
      })
    );
  });

  it('shareholderModal should open modal with type shareholderModal', (done) => {
    const shareholderMock = { id: 20 } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(shareholderMock),
    } as any);

    service.shareholderModal(shareholderMock).subscribe(result => {
      expect(result).toEqual(shareholderMock);
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalFormComponent,
      jasmine.objectContaining({
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '80vh',
        maxWidth: '80vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border',
        data: {
          type: 'shareholderModal',
          dataClient: shareholderMock,
          dataConfigAdministratorExercisingPfControl: undefined,
          isMaintenance: maintenanceMock,
          minFiscalData: undefined,
          isCotitular: undefined,
        },
      })
    );
  });

  it('addShareholderModal should open modal with type addShareholderModal', (done) => {
    const shareholderMock = { id: 30 } as any;

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of(shareholderMock),
    } as any);

    service.addShareholderModal(shareholderMock).subscribe(result => {
      expect(result).toEqual(shareholderMock);
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalFormComponent,
      jasmine.objectContaining({
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '80vh',
        maxWidth: '80vw',
        minWidth: 'auto',
        panelClass: 'custom-dialog-border',
        data: {
          type: 'addShareholderModal',
          dataClient: shareholderMock,
          dataConfigAdministratorExercisingPfControl: undefined,
          isMaintenance: maintenanceMock,
          minFiscalData: undefined,
          isCotitular: undefined,
        },
      })
    );
  });

  it('bankContractLinkingModal should open modal with contracts data', (done) => {
    const contractsMock = [{ id: 1 }, { id: 2 }];

    matDialogSpy.open.and.returnValue({
      afterClosed: () => of('closed'),
    } as any);

    service.bankContractLinkingModal(contractsMock).subscribe(result => {
      expect(result).toBe('closed');
      done();
    });

    expect(matDialogSpy.open).toHaveBeenCalledWith(
      ModalFormComponent,
      jasmine.objectContaining({
        disableClose: true,
        minHeight: 'auto',
        maxHeight: '80vh',
        maxWidth: '80vw',
        minWidth: '50vw',
        panelClass: 'custom-dialog-border',
        data: {
          type: 'bankContractLinking',
          contracts: contractsMock,
          isMaintenance: maintenanceMock,
        },
      })
    );
  });

  it('closeModal should close dialog and reset dialogRef', () => {
    const closeSpy = jasmine.createSpy('close');
    (service as any).dialogRef = {
      close: closeSpy,
    } as unknown as MatDialogRef<ModalFormComponent>;

    service.closeModal();

    expect(closeSpy).toHaveBeenCalled();
    expect(service.getDialogRef()).toBeNull();
  });

  it('closeModal should do nothing when dialogRef is null', () => {
    (service as any).dialogRef = null;

    expect(() => service.closeModal()).not.toThrow();
    expect(service.getDialogRef()).toBeNull();
  });

  it('getDialogRef should return current dialogRef', () => {
    const fakeDialogRef = {
      close: jasmine.createSpy('close'),
    } as any;

    (service as any).dialogRef = fakeDialogRef;

    expect(service.getDialogRef()).toBe(fakeDialogRef);
  });
});
