import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PldQuizPmService {

  public pldQuizData = signal<any>({});
  public readonly initialPldQuizData = {};
  public readonly isMaintenance = signal<boolean>(false);
  public readonly isEditable = signal<boolean>(true);

  constructor(){
    // TODO: call Api's and set values from it here
    if(this.isMaintenance()){
      this.pldQuizData.set({});
      this.initialPldQuizData = this.pldQuizData();
    }
  }

}
