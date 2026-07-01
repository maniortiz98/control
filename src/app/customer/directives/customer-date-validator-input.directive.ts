import { Directive } from '@angular/core';
import {
    AbstractControl,
    NG_VALIDATORS,
    ValidationErrors,
    Validator
} from '@angular/forms';
import moment from 'moment';

@Directive({
    selector: '[appDateValidator]',
    standalone: false,
    providers: [
        { provide: NG_VALIDATORS, useExisting: CustomerDateValidatorDirective, multi: true }
    ]
})
export class CustomerDateValidatorDirective implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;

        const date = moment(control.value, 'DD/MM/YYYY', true);
        if (!date.isValid()) return { dateInvalid: true };

        return null;
    }
}