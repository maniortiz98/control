import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AlphanumericOnlyDirective } from './alphanumeric-only.directive';

@Component({
    standalone: false,
    template: `<input type="text" name="testInput" [(ngModel)]="value" appAlphanumericOnly>`
})
class TestComponent {
    value = '';
}

describe('AlphanumericOnlyDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, AlphanumericOnlyDirective],
            imports: [FormsModule]
        });

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should create an instance', () => {
        const directive = new AlphanumericOnlyDirective();
        expect(directive).toBeTruthy();
    });

    it('should allow alphanumeric characters on keydown', () => {
        const event = new KeyboardEvent('keydown', { key: 'A' });
        spyOn(event, 'preventDefault');

        input.dispatchEvent(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow special navigation keys on keydown', () => {
        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        spyOn(event, 'preventDefault');

        input.dispatchEvent(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should block non alphanumeric characters on keydown', () => {
        const event = new KeyboardEvent('keydown', { key: '$' });
        spyOn(event, 'preventDefault');

        input.dispatchEvent(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should remove the first leading non alphanumeric character on input', () => {
        input.value = '$%ABC123';

        input.dispatchEvent(new Event('input'));

        expect(input.value).toBe('%ABC123');
    });

    it('should keep internal non alphanumeric characters because only leading chars are sanitized', () => {
        input.value = 'ABC$123';

        input.dispatchEvent(new Event('input'));

        expect(input.value).toBe('ABC$123');
    });
});
