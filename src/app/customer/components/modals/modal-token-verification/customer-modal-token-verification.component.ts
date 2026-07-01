
import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, } from '@angular/material/card';
import { APIS_SERVICES } from '../../../constants/customer-constants';
import { CustomerApisServices } from '../../../types/customer-catalogs.type';
import { CustomerOtcService } from '../../../services/customer-otc.service';
import { CustomerNotificationModalService } from '../../../services/customer-notification-modal.service';
import { CustomerOtcMailRequest, CustomerOtcMailResponse } from '../../../models/customer-otc-mail-request';
import { ERROR_MESSAGES } from '../../../constants/customer-form-messages';
import { CustomerOtcValidateSmsResponse } from '../../../models/customer-otc-validate';
import { CustomerOtcSmsResponse } from '../../../models/customer-otc-sms';
import { CustomerNotificationsService } from '../../../services/customer-notifications.service';

@Component({
  selector: 'modal-token-verification',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardActions,
    MatCardContent,
  ],
  templateUrl: './customer-modal-token-verification.component.html',
  styleUrl: './customer-modal-token-verification.component.css'
})
export class CustomerModalTokenVerificationComponent implements OnInit, AfterViewInit {

  readonly data = inject(MAT_DIALOG_DATA) as {
    notificationType: string,
    message: string,
    inputLength: number
  };

  readonly dialogRef = inject(MatDialogRef<CustomerModalTokenVerificationComponent>);
  private readonly otcService = inject(CustomerOtcService);
  private readonly notificationModalService = inject(CustomerNotificationModalService)
  private readonly notificationService = inject(CustomerNotificationsService);

  otcResponseSms = signal<CustomerOtcSmsResponse | null>(null);
  otcResponseEmail = signal<CustomerOtcMailResponse | null>(null);
  otcError = signal(false);
  retryAttemps: number = 1;
  inputsArray: number[] = [];

  @ViewChildren('codeInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  ngOnInit(): void {
    console.log(this.data)
    if (!this.data.inputLength) {
      this.data.inputLength = 6;
    }
    this.inputsArray = Array(this.data.inputLength).fill(0);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.inputs.first?.nativeElement.focus();
    });
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < this.inputs.length - 1) {
      this.inputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = this.inputs.get(index)?.nativeElement;
    if (event.key === 'Backspace') {
      if (input?.value === '' && index > 0) {
        const prevInput = this.inputs.get(index - 1)?.nativeElement;
        prevInput?.focus();
        prevInput!.value = '';
        event.preventDefault();
      }
    }
  }

  readonly ofuscatedData = computed(() => {
    const msg = this.data.message;
    if (this.data.notificationType === 'mail' && msg.includes('@')) {
      const [user, dom] = msg.split('@');
      const visible = user.slice(-2);
      const ofus = '*'.repeat(Math.max(0, user.length - 2));
      return ofus + visible + '@' + dom;
    } else {
      const visible = msg.slice(-2);
      const ofus = '*'.repeat(Math.max(0, msg.length - 2));
      return ofus + visible;
    }
  });

  verify(): void {
    const code = this.inputs.map((i) => i.nativeElement.value).join('');


    if (this.data.notificationType == 'mail') {

      let otcValidRequest = {
        otc: code,
        type: '',
        email: this.data.message
      };

      this.otcService.validateEmail(otcValidRequest)
        .subscribe({
          // TODO configurar un modelo al response y adecuar el resultado.
          next: (response: any) => {
            console.log(response);
            this.otcResponseEmail.set(response);

            if (response.payload.result === 'SUCCESS') {
              console.log('correct');
              this.dialogRef.close(code);
            } else {
              if (response.intents > 3) {
                console.log('lanzando el otro modal')
                this.notificationModalService.confirm(
                  {
                    title: 'Demasiados Intentos',
                    afterMessages: [
                      ERROR_MESSAGES.TOKEN_EXCED_RETRY,
                    ],
                    btnAccept: 'Cerrar',
                  }
                )
                this.dialogRef.close();
              }
              this.otcError.set(true);

            }
          },
          error: (err: any) => {

            this.otcError.set(true);
            this.resetInputs()
            if (this.retryAttemps > 2) {
              console.log('lanzando el otro modal')
              this.notificationModalService.confirm(
                {
                  title: 'Demasiados Intentos',
                  afterMessages: [
                    ERROR_MESSAGES.TOKEN_EXCED_RETRY,
                  ],
                  btnAccept: 'Cerrar',
                }
              )
              this.dialogRef.close();
            } else {
              console.log('lanzando notificación')
              this.notificationService.error('Código Incorrecto', 'Ingrese el Código Correcto')
              this.retryAttemps++;
              console.log(this.retryAttemps);
            }
          }
        });
    } else {
      let otcValidRequest = {
        otc: code,
        type: '',
        phoneNumber: this.data.message
      };

      this.otcService.validateSms(otcValidRequest)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.otcResponseSms.set(response);

            if (response.payload.result === 'SUCCESS') {
              console.log('correct');
              this.dialogRef.close(code);
            } else {
              this.otcError.set(true);
            }
          },
          error: (err: any) => {
            this.otcError.set(true);
            this.resetInputs()
            if (this.retryAttemps > 2) {
              console.log('lanzando el otro modal')
              this.notificationModalService.confirm(
                {
                  title: 'Demasiados Intentos',
                  afterMessages: [
                    ERROR_MESSAGES.TOKEN_EXCED_RETRY,
                  ],
                  btnAccept: 'Cerrar',
                }
              )
              this.dialogRef.close();
            } else {
              console.log('lanzando notificación')
              this.notificationService.error('Código Incorrecto', 'Ingrese el Código Correcto')
              this.retryAttemps++;
              console.log(this.retryAttemps);
            }
          }
        });
    }
  }

  reSend(): void {
    console.log('sending')
    this.otcError.set(false)
    if (this.data.notificationType == 'mail') {

      let mailBody: CustomerOtcMailRequest = {
        //code: "",
        email: this.data.message,
        //onboarding: ""
      }

      this.otcService.sendEmail(mailBody).subscribe(i => {
        console.log('sending mail' + this.data.notificationType)
        console.log(i)
      })

    } else if (this.data.notificationType == 'phone') {
      const body = {
        code: "",
        phoneNumber: this.data.message,
        onboarding: ""
      }
      this.otcService.sendSms(body).subscribe(i => {
        console.log('sending sms' + this.data.notificationType)
        console.log(i)
      })
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  resetInputs(): void {
    this.inputs.forEach(inputRef => {
      inputRef.nativeElement.value = '';
    });
    this.otcError.set(false);
    this.inputs.first?.nativeElement.focus();
  }
}









