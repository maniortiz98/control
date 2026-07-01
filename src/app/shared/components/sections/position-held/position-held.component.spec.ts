import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import moment from 'moment';

import { PositionHeldComponent } from './position-held.component';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { formatDateYYYYMMDD } from '../../../utils/datetime';

describe('PositionHeldComponent', () => {
  let component: PositionHeldComponent;
  let fixture: ComponentFixture<PositionHeldComponent>;
  let catalogService: jasmine.SpyObj<CatalogsService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;

  beforeEach(async () => {
    catalogService = jasmine.createSpyObj<CatalogsService>('CatalogsService', ['getRelationships', 'getOccupations']);
    notificationsService = jasmine.createSpyObj<NotificationsService>('NotificationsService', ['error']);

    catalogService.getRelationships.and.returnValue(of([{ id: '1', description: 'Padre' }] as any));
    catalogService.getOccupations.and.returnValue(of([{ id: '1', description: 'Director' }] as any));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PositionHeldComponent],
      providers: [
        { provide: CatalogsService, useValue: catalogService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: MatDialog, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(PositionHeldComponent, {
        set: { template: '' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PositionHeldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load catalogs and patch input data on init', () => {
    component.data = {
      chargeDueDate: '2026-12-31',
      relationship: 'Padre',
      positionHeld: 'Director'
    } as any;

    component.ngOnInit();

    expect(catalogService.getRelationships).toHaveBeenCalled();
    expect(catalogService.getOccupations).toHaveBeenCalledWith({ ocupationIds: [] });
    expect(component.profileForm.get('chargeDueDate')?.value).toBe(formatDateYYYYMMDD('2026-12-31' as any));
    expect(component.profileForm.get('relationship')?.value).toBe('Padre');
    expect(component.profileForm.get('positionHeld')?.value).toBe('Director');
  });

  it('should return null and notify when the form is invalid', async () => {
    component.ngOnInit();

    const result = await component.sendInformation();

    expect(result).toBeNull();
    expect(notificationsService.error).toHaveBeenCalledWith('Faltan campos obligatorios por capturar');
  });

  it('should notify invalid past charge due date when form is invalid and date is before today', async () => {
    component.ngOnInit();
    component.profileForm.patchValue({
      chargeDueDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      relationship: '',
      positionHeld: ''
    });

    const result = await component.sendInformation();

    expect(result).toBeNull();
    expect(notificationsService.error).toHaveBeenCalledWith('Fecha de Vencimiento de Cargo no Válida');
  });

  it('should return the mapped payload when the form is valid', async () => {
    component.ngOnInit();
    component.profileForm.setValue({
      chargeDueDate: '2026-12-31',
      relationship: 'Padre',
      positionHeld: 'Director'
    });

    const result = await component.sendInformation();

    expect(result).toEqual({
      chargeDueDate: '2026-12-31',
      relationship: 'Padre',
      positionHeld: 'Director'
    } as any);
  });

  it('should select the chosen date in the datepicker', () => {
    const selectSpy = jasmine.createSpy('select');
    component.pickerBirthdate = { select: selectSpy } as any;
    const date = new Date('2026-12-31');

    component.onDateInput({ value: date } as any);

    expect(selectSpy).toHaveBeenCalledWith(date);
  });
});