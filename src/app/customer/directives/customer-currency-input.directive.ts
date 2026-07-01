import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCurrencyInput]',
  standalone: false
})
export class CustomerCurrencyInputDirective {
  @Input() maxLength: number = 15;

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  private formatCurrency(input: HTMLInputElement): void {
    const numericValue = parseFloat(input.value);
    
    if (!isNaN(numericValue)) {
      input.value = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numericValue);
    }
  }

  ngAfterViewInit(): void {
    const input = this.elementRef.nativeElement;
    if (input.value && input.value.trim() !== '') {
      this.formatCurrency(input);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const allowed = /^[0-9]$/;
    const special = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
    if ( !allowed.test(event.key) && !special.includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;    
    value = value.replace(/[^0-9.]/g, '');
    
    const parts = value.split('.');
    
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
      const newParts = value.split('.');
      parts[0] = newParts[0];
      parts[1] = newParts[1];
    }
    
    if (parts[0] && parts[0].length > this.maxLength) {
      parts[0] = parts[0].substring(0, this.maxLength);
      value = parts[0] + (parts[1] ? '.' + parts[1] : '');
    }
    
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      value = parts[0] + '.' + parts[1];
    }
    
    input.value = value;
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formatCurrency(input);
  }

  @HostListener('focus', ['$event'])
  onFocus(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.]/g, '');
  }
}
