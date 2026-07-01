import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EquityModalComponent } from './equity-modal.component';
import { NotificationsService } from '../../../../../shared/services/notifications.service';
import { ERROR_MESSAGES } from '../../../../../onboarding/constants/form-messages';
import { EquityStrategyItem } from '../../../../models/equity-stategy';

describe('EquityModalComponent', () => {
    let component: EquityModalComponent;
    let fixture: ComponentFixture<EquityModalComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<EquityModalComponent>>;
    let notificationsService: jasmine.SpyObj<NotificationsService>;

    const strategyItem: EquityStrategyItem = {
        idStrategy: 25,
        cveStrategy: 'DIV',
        description: 'Dividendos',
        minimumAmount: 2500,
        active: false,
    };

    let dialogData: { id?: number; content?: EquityStrategyItem | null };

    beforeEach(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        notificationsService = jasmine.createSpyObj('NotificationsService', ['error']);
        dialogData = {
            id: undefined,
            content: null,
        };

        await TestBed.configureTestingModule({
            declarations: [EquityModalComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dialogData },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: NotificationsService, useValue: notificationsService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(EquityModalComponent, {
                set: { template: '' },
            })
            .compileComponents();
    });

    afterEach(() => {
        document.body.classList.remove('show-validation');
    });

    const createComponent = (): void => {
        fixture = TestBed.createComponent(EquityModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('should create', () => {
        createComponent();

        expect(component).toBeTruthy();
    });

    it('should patch form values and title on ngOnInit when dialog has content', () => {
        dialogData.id = strategyItem.idStrategy;
        dialogData.content = strategyItem;

        createComponent();

        expect(component.title).toBe('Edit element');
        expect(component.form.getRawValue()).toEqual({
            idStrategy: 25,
            cveStrategy: 'DIV',
            description: 'Dividendos',
            minimumAmount: 2500,
            active: false,
        });
    });

    it('should patch only idStrategy and keep add title when dialog has no content', () => {
        dialogData.id = 9;

        createComponent();

        expect(component.title).toBe('Add element');
        expect(component.form.getRawValue().idStrategy).toBe(9);
        expect(component.form.getRawValue().cveStrategy).toBe('');
    });

    it('should close dialog with normalized form payload on valid submit', () => {
        dialogData.id = 30;
        createComponent();

        component.form.patchValue({
            cveStrategy: 'GROWTH',
            description: 'Growth strategy',
            minimumAmount: '1000',
            active: true,
        });

        component.onSubmit();

        expect(dialogRef.close).toHaveBeenCalledWith({
            idStrategy: 30,
            cveStrategy: 'GROWTH',
            description: 'Growth strategy',
            minimumAmount: 1000,
            active: true,
        });
        expect(notificationsService.error).not.toHaveBeenCalled();
    });

    it('should mark invalid controls, show validation state and notify on invalid submit', () => {
        createComponent();

        component.onSubmit();

        expect(dialogRef.close).not.toHaveBeenCalled();
        expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
        expect(document.body.classList.contains('show-validation')).toBeTrue();
        expect(component.form.controls['cveStrategy'].touched).toBeTrue();
        expect(component.form.controls['description'].touched).toBeTrue();
        expect(component.form.controls['minimumAmount'].touched).toBeTrue();
    });

    it('should close dialog without payload when close is called', () => {
        createComponent();

        component.close();

        expect(dialogRef.close).toHaveBeenCalledWith();
    });
});