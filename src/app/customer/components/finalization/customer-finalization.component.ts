import { Component, inject, signal } from '@angular/core';
import { ColumnsDataTable, ConfigDataTable } from '../../models/customer-table-interfaces';
import { Router } from '@angular/router';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';

@Component({
  selector: 'app-customer-finalization',
  standalone: false,
  templateUrl: './customer-finalization.component.html',
  styleUrl: './customer-finalization.component.scss'
})
export class CustomerFinalizationComponent {

  infoToCopy: string = '010101';

  private readonly router = inject(Router);
  private readonly onboardingService = inject(CustomerOnboardingService);

  contractData = signal<any[]>([]);
  contractColumns: Array<ColumnsDataTable> = [];
  contractConfigs: ConfigDataTable = { showPag: false, showEditAction: false, showDeleteAction: false, showViewAction: false, multipleSelection: false };

  registryData = signal<any[]>([]);
  registryColumns: Array<ColumnsDataTable> = [];
  registryConfigs: ConfigDataTable = { showPag: false, showEditAction: false, showDeleteAction: false, showViewAction: false, multipleSelection: false };

  response = (this.onboardingService as any).getOnboardingRegister();
  /*
    Respuesta esperada de onboarding/register (se almacena response.data):
    {
      "contracts": [],
      "members": [
          {
              "type": "TITULAR",
              "clientId": "11704145",
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
      { name: 'contractType', title: 'Contrato', show: true, type: '' },
      { name: 'contractNumber', title: 'No. de Contrato', show: true, type: '' },
    ]

    this.registryColumns = [
      { name: 'type', title: 'Registro', show: true, type: '' },
      { name: 'clientId', title: 'No. de Cliente', show: true, type: '' },
      { name: 'firstName', title: 'Primer Nombre', show: true, type: '' },
      { name: 'lastName', title: 'Primer Apellido', show: true, type: '' },
    ]

    const members = this.response['members'] || [];
    const titular = members.find((m: any) => m.type === 'TITULAR');
    this.infoToCopy = titular?.clientId || '';
    this.contractData.set(this.response['contracts'] || []);
    this.registryData.set(members);

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

  accept() {
    this.onboardingService.clearOnboardingInfo();
    this.router.navigate(['/onboarding'])
  }
}




