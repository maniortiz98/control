import { ChangeDetectorRef, Component, inject, signal, input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EconomicActivity } from '../../../../onboarding/models/economic-activity';
import { Occupation } from '../../../../onboarding/models/occupation';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { CATALOG_NAME, STRINGS } from '../../../../onboarding/constants/constants';
import { CatalogsAllowed } from '../../../types/catalogs.type';
import { Countries } from '../../../../onboarding/models/country';
import { IdentificationType } from '../../../../onboarding/models/identification-type';
import { Relationships } from '../../../../onboarding/models/relationships';
import { MiscellaneousInfo } from '../../../../onboarding/models/miscellaneous-section';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

@Component({
  selector: 'app-miscellaneous-section',
  standalone: false,
  templateUrl: './miscellaneous-section.component.html',
  styleUrl: './miscellaneous-section.component.scss'
})
export class MiscellaneousSectionComponent implements OnInit {

  initialData = input.required<MiscellaneousInfo | null>()
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly catalogsService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService)

  hasTaxSection = input.required<boolean>();
  isNotExecutor = input<boolean>(true);
  showProfession = input<boolean>(false);
  hasFiscalCountry = input<boolean>(false);
  hasRelacionship = input<boolean>(true);

  ipabEnabled = input<boolean>(false);
  defaultPercentage = input<number>(0);
  signatureClass = input<boolean>(false);

  form: FormGroup = this.fb.group({
    relationship: [''],
    economicActivity: ['', Validators.required],
    occupation: ['', Validators.required],
    profession: [''],

    workCompany: [''],
    positionHeld: [''],
    phoneBusiness: [''],

    fiscalCountry: ['', Validators.required],
    //fiscalIdentificationNumber: ['', Validators.required],

    ipabTitularityPercent: ['', Validators.required],
    retentionIsr: ['', Validators.required],
    signClass: ['A', Validators.required],
  });

  economicActivities = signal<Array<EconomicActivity>>([]);
  occupations = signal<Array<Occupation>>([]);
  countries = signal<Array<Countries>>([]);
  identificationTypes = signal<Array<IdentificationType>>([]);
  relationships = signal<Array<Relationships>>([]);
  taxRegimens: string[] = ['GENERAL DE LEY PERSONAS MORAL', 'OTROS'];
  professions: string[] = ['ABOGADO', 'DOCTOR'];
  signClass: string[] = ['A', 'B', 'C'];

  filteredEconomicActivities = signal<EconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');

  constructor() {
    this.economicActivityFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities.set(
        this.economicActivities().filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
  }

  ngOnInit() {
    this.catalogsService.getEconomicActivity({ lineBusinessId: [] }).subscribe(i => {
      this.economicActivities.set(i);
      this.filteredEconomicActivities.set(i);
    })

    this.catalogsService.getOccupations({ ocupationIds: [] }).subscribe(i => {
      this.occupations.set(i);
    })

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogsService.getIdentificationType({ types: [] }).subscribe(c => {
      this.identificationTypes.set(c);
    });

    this.catalogsService.getRelationships({ bool: '', clientId: '', language: '' }).subscribe(c => {
      this.relationships.set(c)
    })
    console.log(this.hasTaxSection())



    if (!this.hasTaxSection()) {
      ['ipabTitularityPercent', 'retentionIsr', 'fiscalCountry'].forEach(field => {
        const control = this.form.get(field);
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
      if (this.hasFiscalCountry()) {
        ['fiscalCountry'].forEach(field => {
          const control = this.form.get(field);
          control?.setValidators(Validators.required);
          control?.updateValueAndValidity();
        });
      }
    }
    console.log('cargando misc-section')
    this.chargeInitialData(this.initialData());
  }

  onSubmit(): MiscellaneousInfo | null {
    if (this.form.valid) {
      if (this.hasTaxSection()) {
        if (!this.validatePercentage(this.form.getRawValue().ipabTitularityPercent)) {
          this.notificationService.error('El porcentaje del Cotitular en IPAB debe ser menor al 100%')
          return null;
        }

        if (!this.validatePercentage(this.form.getRawValue().retentionIsr)) {
          this.notificationService.error('El porcentaje del Cotitular en ISR debe ser menor al 100%')
          return null;
        }
      }
      return {
        relationship: this.form.getRawValue().relationship,
        economicActivity: this.form.getRawValue().economicActivity,
        occupation: this.form.getRawValue().occupation,
        profession: this.form.getRawValue().profession,
        workCompany: this.form.getRawValue().workCompany,
        positionHeld: this.form.getRawValue().positionHeld,
        phoneBusiness: this.form.getRawValue().phoneBusiness,
        fiscalCountry: this.form.getRawValue().fiscalCountry,
        //fiscalIdentificationNumber: this.form.getRawValue().fiscalIdentificationNumber,

        ipabTitularityPercent: this.form.getRawValue().ipabTitularityPercent,
        retentionIsr: this.form.getRawValue().retentionIsr,
        signClass: this.form.getRawValue().signClass ?? 'A',
      }
    } else {
      Object.entries(this.form.controls).forEach(([fieldName, control]) => {
        if (control.invalid) {
          console.error(`Campo inválido: ${fieldName}`, control.errors);
          control.markAsTouched();
        }
      });

      this.notificationService.error(
        ERROR_MESSAGES.MISSING_INFO
      );

      return null;
    }
  }

  chargeInitialData(content: MiscellaneousInfo | null) {

    if (content) {
      this.form.patchValue({
        relationship: content.relationship,
        economicActivity: content.economicActivity,
        occupation: content.occupation,
        profession: content.profession,
        workCompany: content.workCompany,
        positionHeld: content.positionHeld,
        phoneBusiness: content.phoneBusiness,
        fiscalCountry: content.fiscalCountry,
        //fiscalIdentificationNumber: content.fiscalIdentificationNumber,
        ipabTitularityPercent: content.ipabTitularityPercent,
        retentionIsr: content.retentionIsr,
        signClass: content.signClass,
      });
    }
    console.log(this.signatureClass())
    if (this.signatureClass() === false) {
      this.form.get('signClass')?.setValue('A');
      this.form.get('signClass')?.disable();
    }

    const relationshipControl = this.form.get('relationship');

    if (this.hasRelacionship()) {
      relationshipControl?.setValidators([Validators.required]);
    } else {
      relationshipControl?.clearValidators();
      relationshipControl?.setValue('');
    }
    relationshipControl?.updateValueAndValidity();


  }

  onlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
    }
  }

  validatePercentage(percentage: number): boolean {
    return percentage < 100;
  }

  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }
}
