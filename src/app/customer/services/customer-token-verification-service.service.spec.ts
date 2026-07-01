import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { of } from "rxjs";
import { CustomerModalTokenVerificationComponent } from "../components/modals/modal-token-verification/customer-modal-token-verification.component";
import { CustomerTokenVerificationServiceService } from "./customer-token-verification-service.service";

describe('CustomerTokenVerificationServiceService', () => {

  let service: CustomerTokenVerificationServiceService;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockAfterClosed = (value: any) => ({
    afterClosed: () => of(value)
  });

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        CustomerTokenVerificationServiceService,
        { provide: MatDialog, useValue: mockDialog }
      ]
    });

    service = TestBed.inject(CustomerTokenVerificationServiceService);
  });

  it('debe abrir modal con datos correctos', async () => {
    mockDialog.open.and.returnValue(
      mockAfterClosed({ message: 'ok' }) as any
    );

    await service.showModal('info', 'test-message', 6);

    const callConfig = mockDialog.open.calls.mostRecent().args[1] as {
      data: Record<string, any>;
    };

    expect(mockDialog.open).toHaveBeenCalledWith(
      CustomerModalTokenVerificationComponent,
      jasmine.objectContaining({
        data: {
          notificationType: 'info',
          message: 'test-message',
          inputLength: 6
        }
      })
    );

    expect(callConfig.data["notificationType"]).toBe('info');
    expect(callConfig.data["message"]).toBe('test-message');
    expect(callConfig.data["inputLength"]).toBe(6);
  });

  it('debe retornar resultado del modal', async () => {
    const mockResult = { message: 'validated' };

    mockDialog.open.and.returnValue(
      mockAfterClosed(mockResult) as any
    );

    const result = await service.showModal('success', 'msg', 4);

    expect(result).toEqual(mockResult);
  });

  it('debe retornar undefined cuando modal se cierra sin valor', async () => {
    mockDialog.open.and.returnValue(
      mockAfterClosed(undefined) as any
    );

    const result = await service.showModal('error', 'msg', 4);

    expect(result).toBeUndefined();
  });

});