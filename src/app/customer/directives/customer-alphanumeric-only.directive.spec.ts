import { Component, DebugElement } from '@angular/core';
import { CustomerAlphanumericOnlyDirective } from './customer-alphanumeric-only.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

@Component({
    standalone: false,
    template: `<input type="text" name="testInput" [(ngModel)]="value" appAlphanumericOnly>`
})
class TestComponent {
    value = '';
}

describe('CustomerAlphanumericOnlyDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent, CustomerAlphanumericOnlyDirective],
            imports: [FormsModule]
        });

        fixture = TestBed.createComponent(TestComponent);
        inputEl = fixture.debugElement.query(By.css('input'));
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = new CustomerAlphanumericOnlyDirective();
        expect(directive).toBeTruthy();
    });

    it('should convert input to uppercase on typing', () => {
        const el = inputEl.nativeElement as HTMLInputElement;
        el.value = 'aaH$L%A123!#-.$%&//=';
        el.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        expect(el.value).toBe('aaH$L%A123!#-.$%&//=');
    });

});
