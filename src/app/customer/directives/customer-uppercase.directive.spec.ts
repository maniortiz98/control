import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerUppercaseDirective } from './customer-uppercase.directive';
import { Component, DebugElement } from '@angular/core';
import { FormsModule, NgControl, FormControl, NgModel } from '@angular/forms';
import { By } from '@angular/platform-browser';

@Component({
  standalone: false,
  template: `<input type="text" name="testInput" [(ngModel)]="value" appUppercase>`
})
class TestComponent {
  value = '';
}
describe('CustomerUppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CustomerUppercaseDirective],
      imports: [FormsModule]
    });

    fixture = TestBed.createComponent(TestComponent);
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should convert input to uppercase on typing', () => {
    const el = inputEl.nativeElement as HTMLInputElement;
    el.value = 'hola áéíóú';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.value).toBe('HOLA AEIOU');
  });

  it('should trim value on blur', () => {
    const el = inputEl.nativeElement as HTMLInputElement;
    el.value = '  texto con espacios  ';
    el.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(el.value).toBe('texto con espacios');
  });

  it('should keep selection range after transformation', () => {
    const el = inputEl.nativeElement as HTMLInputElement;
    el.value = 'hola áé';
    el.setSelectionRange(0, 2); // 'ho'
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.selectionStart).toBe(0);
    expect(el.selectionEnd).toBe(2);
  });

  // it('should not call setValue if value is unchanged', () => {
  //   const directive = inputEl.injector.get(CustomerUppercaseDirective);
  //   const spy = spyOn(directive.control.control!, 'setValue');
  //   const el = inputEl.nativeElement as HTMLInputElement;
  //   el.value = 'YA ES MAYUSCULA';
  //   el.dispatchEvent(new Event('input'));
  //   fixture.detectChanges();
  //   expect(spy).not.toHaveBeenCalled();
  // });

});
