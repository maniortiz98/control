import { FormControl } from '@angular/forms';
import { DateValidatorDirective } from './date-validator-input.directive';

describe('DateValidatorDirective', () => {
    let directive: DateValidatorDirective;

    beforeEach(() => {
        directive = new DateValidatorDirective();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should return null when control value is empty', () => {
        const control = new FormControl('');

        const result = directive.validate(control);

        expect(result).toBeNull();
    });

    it('should return null when date has valid DD/MM/YYYY format', () => {
        const control = new FormControl('20/05/2026');

        const result = directive.validate(control);

        expect(result).toBeNull();
    });

    it('should return null for a valid leap year date', () => {
        const control = new FormControl('29/02/2024');

        const result = directive.validate(control);

        expect(result).toBeNull();
    });

    it('should return dateInvalid when format is incorrect', () => {
        const control = new FormControl('2026-05-20');

        const result = directive.validate(control);

        expect(result).toEqual({ dateInvalid: true });
    });

    it('should return dateInvalid when date does not exist', () => {
        const control = new FormControl('31/02/2026');

        const result = directive.validate(control);

        expect(result).toEqual({ dateInvalid: true });
    });
});