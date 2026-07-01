import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: false
})
export class CustomerUppercaseDirective {

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const currentValue = input.value;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    let newValue = currentValue.toUpperCase();
    newValue = newValue.replace(/[áÁ]/g, "A")
      .replace(/[éÉ]/g, "E")
      .replace(/[íÍ]/g, "I")
      .replace(/[óÓ]/g, "O")
      .replace(/[úÚ]/g, "U");

    input.value = newValue;
    input.setSelectionRange(start, end);

    if ( currentValue != newValue ) {
      this.control.control?.setValue(newValue);
    }
  }

  @HostListener('blur') onBlur() {
    const currentValue = this.el.nativeElement.value;
    const trimmedValue = currentValue.trim();

    if (currentValue !== trimmedValue) {
      this.control.control?.setValue(trimmedValue);
    }
  }

}
