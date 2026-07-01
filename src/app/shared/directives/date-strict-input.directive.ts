import { Directive, HostListener, ElementRef } from '@angular/core';
import moment from 'moment';

@Directive({
    selector: '[appDateInputStrict]',
    standalone: false,
})
export class DateInputStrictDirective {

    constructor(private el: ElementRef<HTMLInputElement>) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        const allowed = /[0-9/]/;
        if (
            !allowed.test(event.key) &&
            !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)
        ) {
            event.preventDefault();
        }
    }

    @HostListener('focusout')
    onFocusOut(): void {
        const value = this.el.nativeElement.value?.trim();

        if (!value) return;

        const parsed = moment(value, 'DD/MM/YYYY', true);

        if (!parsed.isValid()) {
            this.clear();
            return;
        }

        this.el.nativeElement.value = parsed.format('DD/MM/YYYY');
        this.dispatchInput();
    }

    private clear(): void {
        this.el.nativeElement.value = '';
        this.dispatchInput();
    }

    private dispatchInput(): void {
        this.el.nativeElement.dispatchEvent(
            new Event('input', { bubbles: true })
        );
    }

    @HostListener('input')
    onInput(): void {
        const input = this.el.nativeElement;
        const value = input.value;

        if (!/^[\d/]*$/.test(value)) {
            input.value = '';
            return;
        }

        if ((value.match(/\//g) || []).length > 2) {
            input.value = '';
            return;
        }

        if (/^\d+$/.test(value) && value.length > 2) {
            input.value = '';
            return;
        }

        const partial = /^\d{0,2}(\/\d{0,2})?(\/\d{0,4})?$/;
        if (!partial.test(value)) {
            input.value = '';
        }
    }
}