import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PldComponent } from './pld.component';

describe('PldComponent', () => {
    let component: PldComponent;
    let fixture: ComponentFixture<PldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and initialize the profile form', () => {
        expect(component).toBeTruthy();
        expect(component.profileForm.contains('curp')).toBeTrue();
        expect(component.profileForm.contains('tipo')).toBeTrue();
    });

    it('should allow submit without side effects', () => {
        expect(() => component.onSubmit()).not.toThrow();
    });

    it('should throw while toUppercase is not implemented', () => {
        expect(() => component.toUppercase('abc')).toThrowError('Method not implemented.');
    });
});
