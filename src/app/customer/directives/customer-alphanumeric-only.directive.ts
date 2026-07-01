import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphanumericOnly]',
  standalone: false
})
export class CustomerAlphanumericOnlyDirective {

  @HostListener('keydown', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const allowed = /^[a-zñA-ZÑ0-9]$/;
    const special = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if ( !allowed.test(event.key) && !special.includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/^[^a-zñA-ZÑ0-9]/g, '');
  }
}
