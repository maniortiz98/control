import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { from, map, mergeMap, Observable, retry, throwError, timer } from "rxjs";
import { CI_IdentificationContact, CustomerInfo, CustomerInformation, CustomerSections } from "../models/customer";
import { NotificationModalService } from "./notification-modal.service";
import { NotificationsService } from "./notifications.service";

@Injectable({
  providedIn: 'root'
})
export class CustomerInformationService {

  private readonly httpService = inject(HttpClientService);
  private readonly urlGetCustomer = environment.api.services.getCheckpointsCustomer;
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly notificationService = inject(NotificationsService);

  constructor() { }

  /**
   * Get Customer Info
   *
   * @param customerId The Customer ID to search
   * @param section The sections of customer information to be returned, if none is provided,
   */
  getCustomerInfo(customerId: number, sections: Array<CustomerSections> = []): Observable<CustomerInformation> {

    let newCustomer: CustomerInformation = {};

    const body = {
      customerNumber: customerId,
    };

    const others = ['initialData', 'generalInformation', 'addresses', 'fiscalResidences', 'factaObligation', 'ppeInformation', 'familyData'];
    const identificationContact = ['identifications', 'telephones', 'emails'];

    return this.httpService.post<CustomerInfo>(this.urlGetCustomer, body).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          if (error?.status === 412) {
            this.notificationService.error('Dato no Encontrado');
            return throwError(() => error);
          }
          return from(
            this.notificationModalService.error({
              title: `Intento Fallido (${retryCount})`,
              afterMessages: ['Intenta Nuevamente'],
              btnAccept: 'OK',
            })
          ).pipe(
            mergeMap(() => timer(0))
          );
        },
      }),
      map((customer: CustomerInfo) => {
        console.log(customer);
        console.log(sections);

        if (0 === sections.length) {
          others.forEach((element) => {
            if (customer[element as keyof CustomerInfo]) {
              newCustomer[element as keyof CustomerInformation] =
                customer[element as keyof CustomerInfo];
            }
          });

          identificationContact.forEach((element) => {
            if (customer.identificationContact) {
              if (customer.identificationContact[element as keyof CI_IdentificationContact]) {
                newCustomer[element as keyof CustomerInformation] =
                  customer.identificationContact[element as keyof CI_IdentificationContact];
              }
            }
          });
        } else {
          for (let idx in sections) {
            let name = sections[idx] as keyof CustomerInfo;

            if (identificationContact.includes(name)) {
              if (customer.identificationContact) {
                if (customer.identificationContact.hasOwnProperty(name)) {
                  newCustomer[name as keyof CustomerInformation] =
                    customer.identificationContact[name as keyof CI_IdentificationContact];
                }
              }
            } else {
              if (customer.hasOwnProperty(name)) {
                newCustomer[name as keyof CustomerInformation] = customer[name];
              }
            }
          }
        }

        console.log(newCustomer);
        return newCustomer;
      }),
    );

  }
}
