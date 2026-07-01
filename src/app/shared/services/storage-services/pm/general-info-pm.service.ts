import { Injectable, signal } from '@angular/core';
import { ColumnsDataTable } from '../../../components/table-results/interfaces';
import { ConstitutiveDocuments } from '../../../../onboarding/models/general-info-pm';

@Injectable({
  providedIn: 'root'
})
export class GeneralInfoPmService {

  public initialGeneralInfoPmData = {};
  public generalInfoPmData = signal<any>({});
  public documents = signal<ConstitutiveDocuments[]>([]);
  public readonly isMaintenance = signal<boolean>(false);
  public readonly isEditable = signal<boolean>(true);

  public columns: ColumnsDataTable[] = [
      { name: 'notaryName', title: 'Nombre de Notario', type:'string', show: true },
      { name: 'documentType', title: 'Tipo de Documento', type:'string', show: true },
      { name: 'deedNumber', title: 'Numero de Escritura', type:'string', show: true },
      { name: 'deedDate', title: 'Fecha de Escritura', type:'string', show: true },
  ];

  constructor(){
    if(this.isMaintenance()){
      // TODO: call Api's and set values from it here
      const columns = [
        {
          documentType: 'test',
          deedNumber: 'test',
          deedDate: 'test',
          notaryNumber: 'test',
          notaryName: 'test',
          protocolSquare: 'test',
          inscriptionDate: 'test',
          govermentContract: 'test',
          publicFolio: 'test',
        },
      ];
      this.documents.set(columns);
      this.generalInfoPmData.set({});
      this.initialGeneralInfoPmData = this.generalInfoPmData();
    }
  }
}