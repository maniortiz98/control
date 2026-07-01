import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { HomonymsPmComponent } from './homonyms-pm.component';
import { HomonymsService } from '../../../shared/services/homonyms.service';

describe('HomonymsPmComponent', () => {
    let fixture: ComponentFixture<HomonymsPmComponent>;
    let component: HomonymsPmComponent;
    let homonymsService: jasmine.SpyObj<HomonymsService>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<HomonymsPmComponent>>;

    beforeEach(async () => {
        homonymsService = jasmine.createSpyObj('HomonymsService', ['getData']);
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        homonymsService.getData.and.returnValue([
            {
                typePerson: 'PM',
                nacio: 'MX',
                name: 'EMPRESA UNO',
                date: '2020-01-01',
                rfc: 'RFC010101AA1',
                nif: 'NIF1',
                ein: 'EIN1',
            } as any,
        ]);

        await TestBed.configureTestingModule({
            declarations: [HomonymsPmComponent],
            providers: [
                { provide: HomonymsService, useValue: homonymsService },
                { provide: MatDialogRef, useValue: dialogRef },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(HomonymsPmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and load modal data on init', () => {
        expect(component).toBeTruthy();
        expect(homonymsService.getData).toHaveBeenCalled();
        expect(component.dataClient.length).toBe(1);
        expect(component.columnsData.length).toBe(7);
        expect(component.config.multipleSelection).toBeTrue();
    });

    it('falls back to an empty array when homonyms service returns null', () => {
        homonymsService.getData.and.returnValue(null as any);

        fixture = TestBed.createComponent(HomonymsPmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(component.dataClient).toEqual([]);
    });

    it('enables continue button when one row is selected', () => {
        component.multipleRows([{ clientNumber: '1' }]);

        expect(component.butonContinue).toBeTrue();
        expect(component.butonUnifi).toBeFalse();
    });

    it('enables unification button when more than one row is selected', () => {
        component.multipleRows([{ clientNumber: '1' }, { clientNumber: '2' }]);

        expect(component.butonContinue).toBeFalse();
        expect(component.butonUnifi).toBeTrue();
    });

    it('resets buttons when there is no selection', () => {
        component.multipleRows([]);

        expect(component.butonContinue).toBeFalse();
        expect(component.butonUnifi).toBeFalse();
    });

    it('closes modal with continue action when no client is selected', () => {
        component.onButtonClickContinueDontSelect();

        expect(dialogRef.close).toHaveBeenCalledWith('continue');
    });

    it('executes auxiliary handlers without side effects', () => {
        spyOn(console, 'log');

        component.rowSelected({});
        component.eventRow({});
        component.eventPage({} as any);
        component.onButtonClickUnifi();
        component.onButtonContinueClient();

        expect(console.log).toHaveBeenCalledTimes(2);
    });
});
