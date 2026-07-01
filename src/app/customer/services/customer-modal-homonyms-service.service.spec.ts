import { TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { of } from "rxjs";
import { CustomerHomonymsComponent } from "../components/customer-homonyms/customer-homonyms.component";
import { CustomerModalHomonymsServiceService } from "./customer-modal-homonyms-service.service";

describe('CustomerModalHomonymsServiceService', () => {

  let service: CustomerModalHomonymsServiceService;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockAfterClosed = (value: any) => ({
    afterClosed: () => of(value)
  });

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        CustomerModalHomonymsServiceService,
        { provide: MatDialog, useValue: mockDialog }
      ]
    });

    service = TestBed.inject(CustomerModalHomonymsServiceService);
  });

  it('debe abrir modal con configuración correcta', async () => {
    mockDialog.open.and.returnValue(
      mockAfterClosed({ ok: true }) as any
    );

    await service.formModalHomonyms();

    const callConfig = mockDialog.open.calls.mostRecent().args[1] as MatDialogConfig;

    expect(mockDialog.open).toHaveBeenCalledWith(
      CustomerHomonymsComponent,
      jasmine.any(Object)
    );

    expect(callConfig.autoFocus).toBeFalse();
    expect(callConfig.disableClose).toBeTrue();
    expect(callConfig.minHeight).toBe('auto');
    expect(callConfig.maxHeight).toBe('90vh');
    expect(callConfig.maxWidth).toBe('90vw');
    expect(callConfig.minWidth).toBe('auto');
    expect(callConfig.panelClass).toBe('custom-dialog-border');
  });

  it('debe retornar resultado del modal', async () => {
    const resultMock = { selected: true };

    mockDialog.open.and.returnValue(
      mockAfterClosed(resultMock) as any
    );

    const result = await service.formModalHomonyms();

    expect(result).toEqual(resultMock);
  });

  it('debe retornar undefined cuando modal no tiene resultado', async () => {
    mockDialog.open.and.returnValue(
      mockAfterClosed(undefined) as any
    );

    const result = await service.formModalHomonyms();

    expect(result).toBeUndefined();
  });

});
``