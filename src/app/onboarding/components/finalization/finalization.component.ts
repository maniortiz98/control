import { Component, inject, signal } from '@angular/core';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { Router } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-finalization',
  standalone: false,
  templateUrl: './finalization.component.html',
  styleUrl: './finalization.component.scss'
})
export class FinalizationComponent {

  infoToCopy: string = '010101';

  private readonly router = inject(Router);
  private readonly onboardingService = inject(OnboardingService);

  contractData = signal<any[]>([]);
  contractColumns: Array<ColumnsDataTable> = [];
  contractConfigs: ConfigDataTable = { showPag: false, showEditAction: false, showDeleteAction: false, showViewAction: false, multipleSelection: false };

  registryData = signal<any[]>([]);
  registryColumns: Array<ColumnsDataTable> = [];
  registryConfigs: ConfigDataTable = { showPag: false, showEditAction: false, showDeleteAction: false, showViewAction: false, multipleSelection: false };

  response = this.onboardingService.getOnboardingRegister();
  /*
    {
      "customerId": "20695508",
      "contracts": [
          {
              "contractId": "60448",
              "contractNumber": "200000105",
              "contractType": "Banco"
          }
      ],
      "members": [
          {
              "type": "",
              "clientId": "",
              "firstName": "",
              "lastName": "",
              "secondLastName": ""
          }
      ]
    }
  */

  copyProspectNumber(): void {
    if (this.infoToCopy) {
      navigator.clipboard.writeText(this.infoToCopy).then(() => {
      });
    }
  }

  ngOnInit() {
    this.contractColumns = [
      { name: 'contractType', title: 'Contrato', show: true, type: 'string' },
      { name: 'contractNumber', title: 'No. de Contrato', show: true, type: 'string' },
    ]

    this.registryColumns = [
      { name: 'type', title: 'Registro', show: true, type: 'string' },
      { name: 'clientId', title: 'No. de Cliente', show: true, type: 'string' },
      { name: 'firstName', title: 'Primer Nombre', show: true, type: 'string' },
      { name: 'lastName', title: 'Primer Apellido', show: true, type: 'string' },
    ]

    this.infoToCopy = this.response['customerId'];
    this.contractData.set(this.response['contracts']);
    this.registryData.set(this.response['members']);

    // TODO ya no será necesario, el response final se guarda en un aseñal y etnonces redirige aqui.
    /* solo confirmar que con esto se cumpla el requerimiento */
    // this.loadInformation();
  }

  async loadInformation() {
    console.log('buscando');

    // Mocks para contratos
    const contractMocks = [
      {
        contract: 'Banco',
        contractNumber: '091238765'
      },
      {
        contract: 'Casa de Bolsa',
        contractNumber: '091238766'
      },
      {
        contract: 'Plan Personal de Retiro',
        contractNumber: '091238767'
      }
    ];

    // Mocks para registros
    const registryMocks = [
      {
        registry: 'Cotitular',
        clientNumber: '239734929',
        fistName: 'RAFAEL',
        lastName: 'MARQUEZ'
      },
      {
        registry: 'Apoderado',
        clientNumber: '239734930',
        fistName: 'MANUEL',
        lastName: 'MIJARES'
      },
      {
        registry: 'Apoderado 2',
        clientNumber: '239734931',
        fistName: 'MIRANDA',
        lastName: 'COSGROVE'
      },
      {
        registry: 'Persona Autorizada',
        clientNumber: '239734932',
        fistName: 'DANIEL',
        lastName: 'RADCLIFFE'
      },
      {
        registry: 'Propietario Real',
        clientNumber: '239734933',
        fistName: 'OCTAVIA',
        lastName: 'SPENCER'
      },
      {
        registry: 'Proveedor de Recursos',
        clientNumber: '239734934',
        fistName: 'HUGH',
        lastName: 'LAURIE'
      }
    ];

    // Actualizar signals con los mocks
    this.contractData.set(contractMocks);
    this.registryData.set(registryMocks);
  }

  accept(){
    this.router.navigate(['/onboarding/kit-contract'])
  }
}
