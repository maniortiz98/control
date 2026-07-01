import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EquityStrategyComponent } from './equity-strategy.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EquityStrategyItem } from '../../../models/equity-stategy';

describe('EquityStrategyComponent', () => {
  let component: EquityStrategyComponent;
  let fixture: ComponentFixture<EquityStrategyComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let catalogsService: jasmine.SpyObj<CatalogsService>;
  let notificationService: jasmine.SpyObj<NotificationsService>;

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const catalogsSpy = jasmine.createSpyObj('CatalogsService', [
      'getStrategiesEquity',
      'createStrategyEquity',
      'updateStrategyEquity',
      'deleteStrategyEquity'
    ]);
    const notificationSpy = jasmine.createSpyObj('NotificationsService', ['success']);

    await TestBed.configureTestingModule({
      declarations: [EquityStrategyComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: CatalogsService, useValue: catalogsSpy },
        { provide: NotificationsService, useValue: notificationSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EquityStrategyComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    catalogsService = TestBed.inject(CatalogsService) as jasmine.SpyObj<CatalogsService>;
    notificationService = TestBed.inject(NotificationsService) as jasmine.SpyObj<NotificationsService>;

    catalogsService.getStrategiesEquity.and.returnValue(of([]));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize columns and refresh list on ngOnInit', () => {
    fixture.detectChanges();
    expect(component.equityStrategyColumns.length).toBe(4);
    expect(catalogsService.getStrategiesEquity).toHaveBeenCalled();
  });

  it('should handle edit event in eventRowEquityStrategy', async () => {
    const event = { type: 'edit', row: { idStrategy: 1, active: 'ACTIVO' } };
    spyOn(component, 'editEquityStrategy');
    await component.eventRowEquityStrategy(event);
    expect(component.editEquityStrategy).toHaveBeenCalledWith(event);
  });

  it('should handle delete event in eventRowEquityStrategy', async () => {
    const event = { type: 'delete', row: { idStrategy: 1 } };
    spyOn(component, 'deleteEquityStrategy');
    await component.eventRowEquityStrategy(event);
    expect(component.deleteEquityStrategy).toHaveBeenCalledWith(event);
  });

  it('should open modal and create strategy in showEquityStrategyModal', async () => {
    const mockResponse = { idStrategy: 1, cveStrategy: 'S', description: 'D', active: true, minimumAmount: 1000 };
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(mockResponse), close: null });
    dialog.open.and.returnValue(dialogRefSpy);
    catalogsService.createStrategyEquity.and.returnValue(of(mockResponse));

    await component.showEquityStrategyModal();

    expect(dialog.open).toHaveBeenCalled();
    expect(catalogsService.createStrategyEquity).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('should open modal and update strategy in editEquityStrategy', async () => {
    const event = { row: { idStrategy: 1, active: 'ACTIVO' } };
    const mockResponse = { idStrategy: 1, cveStrategy: 'S', description: 'D', active: true, minimumAmount: 1000 };
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(mockResponse), close: null });
    dialog.open.and.returnValue(dialogRefSpy);
    catalogsService.updateStrategyEquity.and.returnValue(of(mockResponse));

    await component.editEquityStrategy(event);

    expect(dialog.open).toHaveBeenCalled();
    expect(catalogsService.updateStrategyEquity).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
  });

  it('should delete strategy in deleteEquityStrategy', async () => {
    const event = { row: { idStrategy: 1 } };
    catalogsService.deleteStrategyEquity.and.returnValue(of({}));

    await component.deleteEquityStrategy(event);

    expect(catalogsService.deleteStrategyEquity).toHaveBeenCalledWith(1);
    expect(notificationService.success).toHaveBeenCalled();
  });
});
