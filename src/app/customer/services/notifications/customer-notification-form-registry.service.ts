import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class CustomerNotificationFormRegistry {

    private form: FormGroup | null = null;
    private initialValue: any = null;

    registerForm(form: FormGroup) {
        this.form = form;
        this.initialValue = structuredClone(form.getRawValue());
    }

    setCurrentSubmitForm(form: FormGroup) {
        this.form = form;
    }

    getCurrentForm() {
        return this.form;
    }

    getInitialValue() {
        return this.initialValue;
    }

}
export type NotificationFormRegistry = CustomerNotificationFormRegistry;

