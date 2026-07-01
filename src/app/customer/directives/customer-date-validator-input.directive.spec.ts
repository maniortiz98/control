import { Directive, HostListener, ElementRef } from '@angular/core';
import moment from 'moment';

@Directive({
    selector: '[appDateInputStrict]'
})
export class CustomerDateInputStrictDirective {

    constructor(private el: ElementRef<HTMLInputElement>) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        const allowedKeys = [
            'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'
        ];

        if (
            allowedKeys.includes(event.key) ||
            /^[0-9/]$/.test(event.key)
        ) {
            return;
        }

        event.preventDefault();
    }

    @HostListener('blur')
    onBlur(): void {
        const value = this.el.nativeElement.value;

        if (!value) return;

        const parsed = moment(value, 'DD/MM/YYYY', true);

        if (!parsed.isValid()) {
            this.el.nativeElement.value = '';
            this.el.nativeElement.dispatchEvent(new Event('input'));
            return;
        }

        this.el.nativeElement.value = parsed.format('DD/MM/YYYY');
        this.el.nativeElement.dispatchEvent(new Event('input'));
    }
}