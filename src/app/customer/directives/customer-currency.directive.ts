import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appCurrencyDirective]',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomerCurrencyDirective),
      multi: true,
    },
  ],
})
export class CustomerCurrencyDirective implements ControlValueAccessor {
  private rawValue = '';
  private isFocused = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(
    private readonly elementRef: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2,
  ) {}

  writeValue(value: string | number | null): void {
    this.rawValue = this.normalizeValue(value);
    this.renderValue();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.input, 'disabled', isDisabled);
  }

  @HostListener('focus')
  onFocus(): void {
    this.isFocused = true;
    this.setElementValue(this.rawValue);
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = this.sanitizeInput(input?.value ?? '');

    this.rawValue = sanitizedValue;
    this.onChange(this.rawValue);

    if (this.input.value !== sanitizedValue) {
      this.setElementValue(sanitizedValue);
    }
  }

  @HostListener('blur')
  onBlur(): void {
    this.isFocused = false;
    this.rawValue = this.normalizeForModel(this.rawValue);
    this.onChange(this.rawValue);
    this.onTouched();
    this.renderValue();
  }

  private get input(): HTMLInputElement {
    return this.elementRef.nativeElement;
  }

  private renderValue(): void {
    const valueToShow = this.isFocused ? this.rawValue : this.formatForView(this.rawValue);
    this.setElementValue(valueToShow);
  }

  private setElementValue(value: string): void {
    this.renderer.setProperty(this.input, 'value', value);
  }

  private sanitizeInput(value: string): string {
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const firstDotIndex = cleanedValue.indexOf('.');

    if (firstDotIndex === -1) {
      return cleanedValue;
    }

    const integerPart = cleanedValue.slice(0, firstDotIndex);
    const decimalPart = cleanedValue.slice(firstDotIndex + 1).replace(/\./g, '').slice(0, 2);

    return `${integerPart}.${decimalPart}`;
  }

  private normalizeValue(value: string | number | null): string {
    if (value == null) {
      return '';
    }

    return this.sanitizeInput(String(value).replace(/[$,\s]/g, ''));
  }

  private normalizeForModel(value: string): string {
    if (!value) {
      return '';
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return '';
    }

    return numericValue.toFixed(2);
  }

  private formatForView(value: string): string {
    if (!value) {
      return '';
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return '';
    }

    const formattedValue = numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `$ ${formattedValue}`;
  }
}
