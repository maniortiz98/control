import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CustomerDateInputStrictDirective } from './customer-date-strict-input.directive';

@Component({
    standalone: false,
    template: `
    <form [formGroup]="form">
      <input appDateInputStrict formControlName="date" />
    </form>
  `
})
class TestHostComponent {
    form = new FormGroup({
        date: new FormControl('')
    });
}

describe('CustomerDateInputStrictDirective – branch coverage', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let input: HTMLInputElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [CustomerDateInputStrictDirective, TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();

        input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should allow a single digit', () => {
        input.value = '1';
        input.dispatchEvent(new Event('input'));
        expect(input.value).toBe('1');
    });

    it('should allow two digits', () => {
        input.value = '12';
        input.dispatchEvent(new Event('input'));
        expect(input.value).toBe('12');
    });

    it('should clear input when numeric value exceeds two digits', () => {
        input.value = '123';
        input.dispatchEvent(new Event('input'));
        expect(input.value).toBe('');
    });

    it('should allow partial date with day and slash', () => {
        input.value = '12/';
        input.dispatchEvent(new Event('input'));
        expect(input.value).toBe('12/');
    });

    it('should clear input when too many slashes are present', () => {
        input.value = '12///';
        input.dispatchEvent(new Event('input'));
        expect(input.value).toBe('');
    });

    it('should allow a complete valid date format', () => {
        input.value = '12/03/2000';
        input.dispatchEvent(new Event('input'));
        expect(input.value).toBe('12/03/2000');
    });

    it('should block alphabetic characters on keydown', () => {
        const event = new KeyboardEvent('keydown', { key: 'A' });
        spyOn(event, 'preventDefault');
        input.dispatchEvent(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should allow navigation keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        spyOn(event, 'preventDefault');
        input.dispatchEvent(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });
});
