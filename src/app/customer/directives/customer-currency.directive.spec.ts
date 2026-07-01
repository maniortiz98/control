import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CustomerCurrencyDirective } from './customer-currency.directive';

@Component({
  standalone: false,
  template: `<input type="text" [formControl]="control" appCurrencyDirective>`,
})
class TestComponent {
  control = new FormControl('');
}

describe('CustomerCurrencyDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CustomerCurrencyDirective],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should format an existing control value when blurred', () => {
    component.control.setValue('1500');
    fixture.detectChanges();

    const el = inputEl.nativeElement as HTMLInputElement;

    expect(el.value).toBe('$ 1,500.00');
    expect(component.control.value).toBe('1500');
  });

  it('should remove visual formatting on focus', () => {
    component.control.setValue('1000.00');
    fixture.detectChanges();

    const el = inputEl.nativeElement as HTMLInputElement;
    el.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(el.value).toBe('1000.00');
    expect(component.control.value).toBe('1000.00');
  });

  it('should keep only numeric input with one decimal point and two decimals', () => {
    const el = inputEl.nativeElement as HTMLInputElement;

    el.dispatchEvent(new Event('focus'));
    el.value = '12.5 .';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(el.value).toBe('12.5');
    expect(component.control.value).toBe('12.5');
  });

  it('should format visually on blur and preserve raw numeric control value', () => {
    const el = inputEl.nativeElement as HTMLInputElement;

    el.dispatchEvent(new Event('focus'));
    el.value = '1000000';
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(el.value).toBe('$ 1,000,000.00');
    expect(component.control.value).toBe('1000000.00');
  });

  it('should round the model shape to two decimals without changing user decimals beyond limit', () => {
    const el = inputEl.nativeElement as HTMLInputElement;

    el.dispatchEvent(new Event('focus'));
    el.value = '120.257';
    el.dispatchEvent(new Event('input'));
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(el.value).toBe('$ 120.25');
    expect(component.control.value).toBe('120.25');
  });
});
