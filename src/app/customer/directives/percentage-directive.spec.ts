/// <reference types="jasmine" />

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CustomerPercentageDirective } from './customer-percentage.directive';

@Component({
  standalone: false,
  template: `<input type="text" name="percentageInput" [(ngModel)]="value" appPercentage>`
})
class TestComponent {
  value = '';
}

describe('CustomerPercentageDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CustomerPercentageDirective],
      imports: [FormsModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new CustomerPercentageDirective();
    expect(directive).toBeTruthy();
  });

  it('should keep valid percentage values between 0 and 100 with up to 2 decimals', () => {
    const el = inputEl.nativeElement as HTMLInputElement;
    const validValues = ['0', '0.0', '.25', '.2', '1.2', '1.25', '50', '50.8', '50.45', '100', '100.00'];

    validValues.forEach((value) => {
      el.value = value;
      el.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(el.value).withContext(`value ${value} should remain unchanged`).toBe(value);
    });
  });

  it('should sanitize invalid values', () => {
    const el = inputEl.nativeElement as HTMLInputElement;

    el.value = '10a.345';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.value).toBe('10.34');

    el.value = '150';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.value).toBe('100');
  });
});

