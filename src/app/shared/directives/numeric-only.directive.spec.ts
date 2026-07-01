import { Component, DebugElement } from '@angular/core';
import { NumericOnlyDirective } from './numeric-only.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

@Component({
  standalone: false,
  template: `<input type="text" name="testInput" [(ngModel)]="value" appNumericOnly>`
})
class TestComponent {
  value = '';
}

describe('NumericOnlyDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
        declarations: [TestComponent, NumericOnlyDirective],
        imports: [FormsModule]
        });

        fixture = TestBed.createComponent(TestComponent);
        inputEl = fixture.debugElement.query(By.css('input'));
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = new NumericOnlyDirective();
        expect(directive).toBeTruthy();
    });

    it('should replace not numbers', () => {
        const el = inputEl.nativeElement as HTMLInputElement;
        el.value = 'h0l4|1$%!';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(el.value).toBe('041');
    });

    it('should replace not numbers', () => {
        const el = inputEl.nativeElement as HTMLInputElement;
        el.value = 'h';
        el.dispatchEvent(new Event('keydown'));
        fixture.detectChanges();
        expect(el.value).toBe('h');
    });

    it('should allow control shortcuts', () => {
        const directive = new NumericOnlyDirective();
        const preventDefault = jasmine.createSpy('preventDefault');

        directive.onKeyPress({
            key: 'v',
            ctrlKey: true,
            metaKey: false,
            preventDefault,
        } as unknown as KeyboardEvent);

        expect(preventDefault).not.toHaveBeenCalled();
    });

});
