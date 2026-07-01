import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalFormComponent } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-modal-homonyms',
  standalone: false,
  templateUrl: './modal-homonyms.component.html',
  styleUrl: './modal-homonyms.component.scss'
})
export class ModalHomonymsComponent {
constructor(
    private readonly modalRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    document.body.classList.remove('show-validation');
  }

  close() {
    this.modalRef.close(null);
  }
}
