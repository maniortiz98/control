import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumericOnly]',
  standalone: false
})
export class CustomerNumericOnlyDirective {

  @HostListener('keydown', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const allowed = /^[0-9]$/;
    const special = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const isShortcut = event.ctrlKey || event.metaKey;

    if (!allowed.test(event.key) && !special.includes(event.key) && !isShortcut) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

}
