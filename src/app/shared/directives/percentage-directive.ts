import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPercentage]',
  standalone: false,
})
export class PercentageDirective {
  private readonly specialKeys = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
  ];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (
      this.specialKeys.includes(event.key) ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const currentValue = input.value ?? '';
    const selectionStart = input.selectionStart ?? currentValue.length;
    const selectionEnd = input.selectionEnd ?? currentValue.length;

    const nextValue =
      currentValue.slice(0, selectionStart) +
      event.key +
      currentValue.slice(selectionEnd);

    if (!this.isPotentiallyValid(nextValue)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = this.sanitize(input.value);

    if (input.value !== sanitizedValue) {
      input.value = sanitizedValue;
      input.dispatchEvent(new Event('input', { bubbles: false }));
    }
  }

  private isPotentiallyValid(value: string): boolean {
    if (value === '' || value === '.') {
      return true;
    }

    if (!/^(?:\d{0,3}|\.\d{0,2}|\d{0,3}\.\d{0,2})$/.test(value)) {
      return false;
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      return false;
    }

    const [integerPart, decimalPart = ''] = value.split('.');
    return integerPart !== '100' || /^0{0,2}$/.test(decimalPart);
  }

  private sanitize(value: string): string {
    let sanitized = (value ?? '')
      .replace(/,/g, '.')
      .replace(/[^0-9.]/g, '');

    const firstDot = sanitized.indexOf('.');
    if (firstDot !== -1) {
      sanitized =
        sanitized.slice(0, firstDot + 1) +
        sanitized.slice(firstDot + 1).replace(/\./g, '');
    }

    if (sanitized === '' || sanitized === '.') {
      return sanitized;
    }

    if (sanitized.startsWith('.')) {
      return `.${sanitized.slice(1, 3)}`;
    }

    const [integerRaw = '', decimalRaw = ''] = sanitized.split('.');
    const integerPart = integerRaw.slice(0, 3);
    const hasDot = sanitized.includes('.');
    let decimalPart = decimalRaw.slice(0, 2);

    if (integerPart === '') {
      return hasDot ? `.${decimalPart}` : '';
    }

    const numericValue = Number(
      hasDot ? `${integerPart}.${decimalPart}` : integerPart,
    );

    if (Number.isNaN(numericValue)) {
      return '';
    }

    if (numericValue > 100) {
      return '100';
    }

    if (integerPart === '100') {
      decimalPart = decimalPart.replace(/[^0]/g, '');
      return decimalPart ? `100.${decimalPart}` : '100';
    }

    return hasDot ? `${integerPart}.${decimalPart}` : integerPart;
  }
}
