import { TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { of } from "rxjs";
import { CustomerModalFormService } from "./customer-modal-form.service";

describe('CustomerModalFormService', () => {

  let service: CustomerModalFormService;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockAfterClosed = (value: any) => ({
    afterClosed: () => of(value),
    close: jasmine.createSpy('close')
  });

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        CustomerModalFormService,
        { provide: MatDialog, useValue: mockDialog }
      ]
    });

    service = TestBed.inject(CustomerModalFormService);
  });

  const maintenance = { all: true, edit: false };

  it('formModalDataPPE', (done) => {
    const response = null;
    mockDialog.open.and.returnValue(mockAfterClosed(response) as any);

    service.formModalDataPPE(maintenance).subscribe(res => {
      expect(res).toEqual(response);

      const config = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

      expect(config.data.type).toBe('ppe');
      expect(config.data.isMaintenance).toEqual(maintenance);
      expect(config.disableClose).toBeTrue();
      expect(config.maxHeight).toBe('80vh');

      done();
    });
  });

  it('formModalDataDepPPE', (done) => {
    mockDialog.open.and.returnValue(mockAfterClosed(null) as any);

    service.formModalDataDepPPE(maintenance).subscribe(() => {

      const config = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

      expect(config.data.type).toBe('ppeDep');
      done();
    });
  });

  it('formModalDataAsoPPE', (done) => {
    mockDialog.open.and.returnValue(mockAfterClosed(null) as any);

    service.formModalDataAsoPPE(maintenance).subscribe(() => {

      const config = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

      expect(config.data.type).toBe('ppeAep');
      done();
    });
  });

  it('homonimiaModal', (done) => {
    const data = [{ firstName: 'test' }] as any;

    mockDialog.open.and.returnValue(mockAfterClosed(data) as any);

    service.homonimiaModal(data).subscribe(res => {
      expect(res).toEqual(data);

      const config = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

      expect(config.data.type).toBe('homonimia');
      expect(config.data.isMaintenance).toEqual({ all: false, edit: false });

      done();
    });
  });

  it('fiscalResidenceModal', (done) => {
    const result = { value: true } as any;

    mockDialog.open.and.returnValue(mockAfterClosed(result) as any);

    service.fiscalResidenceModal({
      data: [],
      table: []
    }, {
      dataCountry: null,
      taxCountry: null,
      hiddenPersonType: false
    }, {
      taxCountry: "",
      countryBirth: ""
    }, true).subscribe(res => {
      expect(res).toEqual(result);

      const config = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

      expect(config.data.type).toBe('fiscalResidence');
      expect(config.data.isCotitular).toBeTrue();

      done();
    });
  });

  it('shareholderModal', (done) => {
    mockDialog.open.and.returnValue(mockAfterClosed(null) as any);

    service.shareholderModal().subscribe(() => {
      const config = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

      expect(config.data.type).toBe('shareholderModal');
      done();
    });
  });

  it('addShareholderModal', (done) => {
    mockDialog.open.and.returnValue(mockAfterClosed(null) as any);

    service.addShareholderModal().subscribe(() => {
      const config = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

      expect(config.data.type).toBe('addShareholderModal');
      done();
    });
  });

  it('bankContractLinkingModal', (done) => {
    const contracts = [{ id: 1 }];
    const response = { ok: true };

    mockDialog.open.and.returnValue(mockAfterClosed(response) as any);

    service.bankContractLinkingModal(contracts).subscribe(res => {
      expect(res).toEqual(response);

      const config = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

      expect(config.data.type).toBe('bankContractLinking');
      expect(config.data.contracts).toEqual(contracts);

      done();
    });
  });

  it('closeModal debe cerrar dialogRef', () => {
    const dialogRefMock = mockAfterClosed(null);

    mockDialog.open.and.returnValue(dialogRefMock as any);

    service.bankContractLinkingModal();

    expect(service.getDialogRef()).not.toBeNull();

    service.closeModal();

    expect(dialogRefMock.close).toHaveBeenCalled();
    expect(service.getDialogRef()).toBeNull();
  });

  it('getDialogRef debe retornar referencia actual', () => {
    const dialogRefMock = mockAfterClosed(null);

    mockDialog.open.and.returnValue(dialogRefMock as any);

    service.bankContractLinkingModal();

    const ref = service.getDialogRef();

    expect(ref).toBeTruthy();
  });

});