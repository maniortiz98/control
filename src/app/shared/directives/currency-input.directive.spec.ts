import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CurrencyInputDirective } from './currency-input.directive';

@Component({
  standalone: false,
  template: `<input appCurrencyInput [value]="initialValue" [maxLength]="maxLength" />`,
})
class TestHostComponent {
  initialValue = '';
  maxLength = 15;
}

describe('CurrencyInputDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let input: HTMLInputElement;

  const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, CurrencyInputDirective],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.query(By.directive(CurrencyInputDirective));

    expect(directive).toBeTruthy();
  });

  it('should format the initial input value after view init', () => {
    component.initialValue = '1234';
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.initialValue = '1234';
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(input.value).toBe(formatCurrency(1234));
  });

  it('should allow numeric keys on keydown', () => {
    const event = new KeyboardEvent('keydown', { key: '5' });
    spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should allow decimal point and navigation keys on keydown', () => {
    const dotEvent = new KeyboardEvent('keydown', { key: '.' });
    const backspaceEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
    spyOn(dotEvent, 'preventDefault');
    spyOn(backspaceEvent, 'preventDefault');

    input.dispatchEvent(dotEvent);
    input.dispatchEvent(backspaceEvent);

    expect(dotEvent.preventDefault).not.toHaveBeenCalled();
    expect(backspaceEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should block non numeric and non special keys on keydown', () => {
    const event = new KeyboardEvent('keydown', { key: 'A' });
    spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should remove non numeric characters and keep only one decimal point on input', () => {
    input.value = 'ab1.2.3$4';

    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('1.23');
  });

  it('should truncate integer digits according to maxLength', () => {
    component.maxLength = 3;
    fixture.detectChanges();
    input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = '12345.67';

    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('123.67');
  });

  it('should truncate decimal digits to two places', () => {
    input.value = '123.4567';

    input.dispatchEvent(new Event('input'));

    expect(input.value).toBe('123.45');
  });

  it('should remove currency formatting characters on focus', () => {
    input.value = '$1,234.50';

    input.dispatchEvent(new Event('focus'));

    expect(input.value).toBe('1234.50');
  });

  it('should format the value as currency on blur', () => {
    input.value = '1234.5';

    input.dispatchEvent(new Event('blur'));

    expect(input.value).toBe(formatCurrency(1234.5));
  });

  it('should keep invalid non numeric text unchanged on blur because formatCurrency ignores NaN', () => {
    input.value = 'abc';

    input.dispatchEvent(new Event('blur'));

    expect(input.value).toBe('abc');
  });
});
