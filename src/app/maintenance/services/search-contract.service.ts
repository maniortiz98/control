import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { HttpClientService } from "../../core/services/http-client.service";

@Injectable({
  providedIn: 'root'
})
export class SearchContractService {

    private readonly httpService = inject(HttpClientService);

    private readonly urlSearch = environment.api.maintenance;


    /**
     * Obtiene la información completa de una cuenta usando su número de cuenta.
     * La respuesta incluye todos los detalles de la cuenta y la información del
     * cliente asociado. La respuesta contiene un objeto 'client' con la información
     * del cliente y un array 'contracts' con los detalles de la cuenta.
     */
    searchByContract(id: string, business: string): Observable<any> {
        const payload = {
            contractNumber: id,
            bankingArea: business
        };
        return this.httpService.post(this.urlSearch.searchContractByNumber, payload);
    }

    /**
     * Obtiene la información del cliente y todos sus contratos asociados usando
     * el número de cliente. La respuesta incluye la información del cliente en
     * el objeto 'client' y un array 'contracts' con todos los contratos asociados.
     */
    searchByCustomer(id: string): Observable<any> {
        const payload = {
            customerNumber: id
        };
        return this.httpService.post(this.urlSearch.searchContractByCustomer, payload);
    }
}