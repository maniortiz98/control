import { Injectable, signal } from '@angular/core';
import { PldQuestionarieDataCheckpoint } from '../../onboarding/models/checkpoints/questionarie-pld-checkpoint';

@Injectable({
  providedIn: 'root'
})
export class PldQuizService {

  public pldQuizData = signal<any>({});
  public readonly initialPldQuizData = {};

  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly();

  constructor(){
    this.initialPldQuizData = this.pldQuizData();
  }

  set(data: PldQuestionarieDataCheckpoint): boolean {
    this._isRequeted.set(true);
    this.pldQuizData.set(data);
    return true;
  }

  clear(){
    this._isRequeted.set(false);
    this.pldQuizData.set({});
  }
}
