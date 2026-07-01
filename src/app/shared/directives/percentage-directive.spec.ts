/// <reference types="jasmine" />

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { PercentageDirective } from './percentage-directive';

@Component({
  standalone: false,
  template: `<input type="text" name="percentageInput" [(ngModel)]="value" appPercentage>`
})
class TestComponent {
  value = '';
}

describe('PercentageDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let input: HTMLInputElement;
  let directive: PercentageDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, PercentageDirective],
      imports: [FormsModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    inputEl = fixture.debugElement.query(By.css('input'));
    input = inputEl.nativeElement as HTMLInputElement;
    directive = inputEl.injector.get(PercentageDirective);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new PercentageDirective();
    expect(directive).toBeTruthy();
  });

  it('should keep valid percentage values between 0 and 100 with up to 2 decimals', () => {
    const validValues = ['0', '0.0', '.25', '.2', '1.2', '1.25', '50', '50.8', '50.45', '100', '100.00'];

    validValues.forEach((value) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(input.value).withContext(`value ${value} should remain unchanged`).toBe(value);
    });
  });

  it('should sanitize invalid values', () => {
    input.value = '10a.345';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('10.34');

    input.value = '150';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('100');
  });

  it('should allow special keys on keydown', () => {
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should allow ctrl and meta shortcuts on keydown', () => {
    const ctrlEvent = new KeyboardEvent('keydown', { key: 'v', ctrlKey: true });
    const metaEvent = new KeyboardEvent('keydown', { key: 'v', metaKey: true });
    spyOn(ctrlEvent, 'preventDefault');
    spyOn(metaEvent, 'preventDefault');

    input.dispatchEvent(ctrlEvent);
    input.dispatchEvent(metaEvent);

    expect(ctrlEvent.preventDefault).not.toHaveBeenCalled();
    expect(metaEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should block keys that would make the value invalid', () => {
    input.value = '100';
    input.setSelectionRange(3, 3);

    const event = new KeyboardEvent('keydown', { key: '1' });
    spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow keys that keep the next value potentially valid', () => {
    input.value = '10';
    input.setSelectionRange(2, 2);

    const event = new KeyboardEvent('keydown', { key: '.' });
    spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should evaluate the next value using the current selection', () => {
    input.value = '99';
    input.setSelectionRange(0, 2);

    const event = new KeyboardEvent('keydown', { key: '5' });
    spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should normalize commas and extra dots on input', () => {
    input.value = '10,2.5.9';

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('10.25');
  });

  it('should preserve a single leading dot with up to two decimals', () => {
    input.value = '.257';

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('.25');
  });

  it('should sanitize 100 values to only allow zero decimals', () => {
    input.value = '100.45';

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('100');
  });

  it('should keep a single dot as a potentially valid intermediate value', () => {
    input.value = '.';

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('.');
  });

  it('should emit a second input event only when sanitization changes the value', () => {
    const dispatchSpy = spyOn(input, 'dispatchEvent').and.callThrough();
    input.value = '12x';

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(dispatchSpy.calls.count()).toBeGreaterThan(1);
  });

  it('should not emit an extra input event when the value is already sanitized', () => {
    const dispatchSpy = spyOn(input, 'dispatchEvent').and.callThrough();
    input.value = '12.3';

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(dispatchSpy.calls.count()).toBe(1);
  });

  it('should treat empty and dot-only values as potentially valid', () => {
    expect((directive as any).isPotentiallyValid('')).toBeTrue();
    expect((directive as any).isPotentiallyValid('.')).toBeTrue();
  });

  it('should reject values outside the 0 to 100 range', () => {
    expect((directive as any).isPotentiallyValid('101')).toBeFalse();
    expect((directive as any).isPotentiallyValid('-1')).toBeFalse();
  });

  it('should only allow zero decimals when integer part is 100', () => {
    expect((directive as any).isPotentiallyValid('100.00')).toBeTrue();
    expect((directive as any).isPotentiallyValid('100.01')).toBeFalse();
  });

  it('should use fallback values when keydown target has nullish value and selection', () => {
    const preventDefault = jasmine.createSpy('preventDefault');

    directive.onKeyDown({
      key: '.',
      ctrlKey: false,
      metaKey: false,
      preventDefault,
      target: {
        value: undefined,
        selectionStart: null,
        selectionEnd: null,
      },
    } as unknown as KeyboardEvent);

    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('should return empty string when sanitize removes all characters', () => {
    expect((directive as any).sanitize('abc')).toBe('');
  });
});
