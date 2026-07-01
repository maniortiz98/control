import { FormGroup } from "@angular/forms";

export function formFunctionDis(formGroup: FormGroup, exceptions: string[] = []) {
  Object.keys(formGroup.controls).forEach(controlName => {
    if (!exceptions.includes(controlName)) {
      formGroup.get(controlName)?.disable();
    }
  });
}

export function formFunctionDisMatch(formGroup: FormGroup, match: string[] = []) {
  Object.keys(formGroup.controls).forEach(controlName => {
    if (match.includes(controlName)) {
      formGroup.get(controlName)?.disable();
    }
  });
}

export function butonFunctionDis(buttonIds: string[]) {
  buttonIds.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
      button.setAttribute('disabled', 'true');
    }
  });
}

export function formFunctionEn(formGroup: FormGroup, enables: string[] = [], exceptions: string[] = []) {
  Object.keys(formGroup.controls).forEach(controlName => {
    const control = formGroup.get(controlName);
    if (control && enables.includes(controlName) && !exceptions.includes(controlName)) {
        control.enable();
    }
  });
}

export function formFunctionEnAll(formGroup: FormGroup, exceptions: string[] = []) {
  Object.keys(formGroup.controls).forEach(controlName => {
    const control = formGroup.get(controlName);
    if (control && !exceptions.includes(controlName)) {
        control.enable();
    }
  });
}

export function buttonFunctionEn(buttonIds: string[], exceptions: string[] = []) {
  buttonIds.forEach(buttonId => {
    if (!exceptions.includes(buttonId)) {
      const button = document.getElementById(buttonId);
      if (button) {
        button.removeAttribute('disabled'); // Elimina el atributo 'disabled'
      }
    }
  });
}
