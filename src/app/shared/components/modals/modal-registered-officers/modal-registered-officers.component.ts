import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../services/notifications.service';
import { EconomicActivity } from '../../../../onboarding/models/economic-activity';
import { Nationalities } from '../../../../onboarding/models/nationality';

interface RegisterdOfficersData {
  tempId: string;
  economicActivity: string;
  prospectSector: string;
  accountType: string;
  operationYears: string;
  riskGroup: string;
  dependents: string;
  firstName: string;
  middleName: string;
  firstSurname: string;
  secondSurname: string;
  nationality: string;
  currentPosition: string;
  positionYears: string;
  industryYears: string;
}

@Component({
  selector: 'app-registered-officers-modal',
  standalone: false,
  templateUrl: './modal-registered-officers.component.html',
  styleUrls: ['./modal-registered-officers.component.scss'],
})
export class RegisteredOfficersModalComponent implements OnInit {
  editForm!: FormGroup;
  existingData: RegisterdOfficersData[];
  sectors = ['Privado', 'Público'];
  riskGroups = ['Bajo', 'Medio', 'Alto'];
  public readonly economicActivity = signal<EconomicActivity[]>([]);
  public readonly nationalities = signal<Nationalities[]>([]);
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      existingData: RegisterdOfficersData[];
      tempId: string;
      economicActivity: string;
      prospectSector: string;
      accountType: string;
      operationYears: string;
      riskGroup: string;
      dependents: string;
      firstName: string;
      middleName: string;
      firstSurname: string;
      secondSurname: string;
      nationality: string;
      currentPosition: string;
      positionYears: string;
      industryYears: string;
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisteredOfficersModalComponent>,
    private notificationService: NotificationsService
  ) {
    // Filter out the current record to avoid self-overlap
    this.existingData = data.existingData.filter(
      (item) => item.tempId !== data.tempId
    );
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      economicActivity: this.data.economicActivity,
      prospectSector: this.data.prospectSector,
      accountType: this.data.accountType,
      operationYears: this.data.economicActivity,
      riskGroup: this.data.riskGroup,
      dependents: this.data.dependents,
      firstName: this.data.firstName,
      middleName: this.data.middleName,
      firstSurname: this.data.firstSurname,
      secondSurname: this.data.secondSurname,
      nationality: this.data.nationality,
      currentPosition: this.data.currentPosition,
      positionYears: this.data.positionYears,
      industryYears: this.data.industryYears,
    });
  }

  save(): void {
    if (this.editForm.invalid) {
      this.notificationService.error(
        'Por favor completa los campos requeridos.'
      );
      return;
    }

    this.dialogRef.close({
      economicActivity: this.data.economicActivity,
      prospectSector: this.data.prospectSector,
      accountType: this.data.accountType,
      operationYears: this.data.economicActivity,
      riskGroup: this.data.riskGroup,
      dependents: this.data.dependents,
      firstName: this.data.firstName,
      middleName: this.data.middleName,
      firstSurname: this.data.firstSurname,
      secondSurname: this.data.secondSurname,
      nationality: this.data.nationality,
      currentPosition: this.data.currentPosition,
      positionYears: this.data.positionYears,
      industryYears: this.data.industryYears,
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
