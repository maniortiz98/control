import { Injectable } from '@angular/core';
import { CatalogsAllowed } from '../../shared/types/catalogs.type';
import { Contract, ContractOnLocalStorage, ContractsLocal } from '../../onboarding/models/contract';
import { SubContract } from '../../onboarding/models/subcontract';
import { PersonType } from '../../onboarding/models/person-type';
import { CatalogSavedLS } from '../../shared/models/catalogs-localstorage';
import { CatalogById } from '../../onboarding/models/economic-activity';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly localStorage: Storage;
  private readonly SIZE_EXCEPTIONS = new Set<string>([
    'cat_advisor'
  ]);

  constructor() {
    this.localStorage = window.localStorage;
  }

  /**
   * Method to get catalog data from Local Storage.
   *
   * @param name - The catalog to be retrieved.
   * @returns null if no data found, or Array of items.
   */
  getCatalog(name: CatalogsAllowed): CatalogSavedLS {
    let catalog = null;
    if (this.isLocalStorageSupported) {
      catalog = this.getItem(`cat_${name}`);
      if (catalog) {
        catalog = JSON.parse(catalog);
        if ('undefined' === typeof catalog.updatedAt) {
          catalog = {
            data: [],
            updatedAt: ''
          };
        }
      } else {
        catalog = {
          data: [],
          updatedAt: ''
        };
      }
    }
    return catalog;
  }

  /**
   * Method to save
   * @param name - The Catalog Name, used to save as key name in Local Storage
   * @param data - Array to be saved.
   */
  setCatalog(name: CatalogsAllowed, data: Array<any>): boolean {
    if (this.isLocalStorageSupported) {
      this.setItem(`cat_${name}`, JSON.stringify({
        data,
        updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      }));
      return true;
    }
    return false;
  }


  /**
   * Get a catalog tagged by id.
   *
   */
  getSeparatedByIdCatalog(catalogName: string): CatalogById {
    return JSON.parse(localStorage.getItem(`cat_${catalogName}`) || '{}');
  }

  /**
   * Save a catalog by tags id.
   * @param data Data to save
   */

  setSeparatedByIdCatalog(catalogName: string, idKey: string, data: any[]): boolean {
    const key = `cat_${catalogName}`;
    const catalogById = JSON.parse(this.localStorage.getItem(key) || '{}');

    catalogById[idKey] = {
      data,
      updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '')
    };

    const payload = JSON.stringify(catalogById);

    return this.setItem(key, payload); 
  }


  // TODO falta agregar expiracion a este catálogo
  /**
   * Set Classification Person
   *
   */
  setClassificationPersonByPersonType(data: PersonType[]): void {
    if (this.isLocalStorageSupported) {
      let classifications = {
        pf: data.filter((item: PersonType) => item.personTypeId === '1'),
        pm: data.filter((item: PersonType) => item.personTypeId === '2'),
      };
      this.setItem(`cat_classificationPerson`, JSON.stringify(classifications));
    }
  }

  // TODO falta agregar expiracion a este catálogo
  /**
   * Save "Contracts" catalog.
   *
   * @param personType If PF (1) PM (2)
   * @param data Data to save
   */
  setContracts(personType: number, data: Contract[]): boolean {
    if (this.isLocalStorageSupported) {
      const newData = data.map((item) => {
        return {
          ...item,
          subcontract: []
        }
      });

      const pt = personType === 1 ? 'pf' : 'pm';
      const local = this.getItem('cat_contracts');
      let contracts: ContractsLocal;

      if (local) {
        contracts = JSON.parse(local);
      } else {
        contracts = {
          pf: [],
          pm: [],
        };
      }

      contracts[pt] = newData;
      this.setItem(`cat_contracts`, JSON.stringify(contracts));
      return true;
    }
    return false;
  }

  // TODO falta agregar expiracion a este catálogo
  /**
   * Save Subcontract catalog.
   *
   * @param personType If PF (1) PM (2)
   * @param The Contract that Subcontracts belogns.
   * @param The subcontracts to be saved.
   */
  setSubcontracts(personType: number, contractId: number, data: SubContract[]): boolean {
    if (this.isLocalStorageSupported) {
      const pt = personType === 1 ? 'pf' : 'pm';
      const local = this.getItem('cat_contracts');
      let contracts: ContractsLocal;

      if (local) {

        contracts = JSON.parse(local);
        const newArr = contracts[pt].map((item: ContractOnLocalStorage) => {
          if (item.contractTypeId === contractId) {
            item.subcontract = data;
          }
          return item;
        });
        contracts[pt] = newArr;
        this.setItem(`cat_contracts`, JSON.stringify(contracts));
        return true;
      }
    }
    return false;
  }

  // TODO falta agregar expiracion a este catálogo
  /**
   * Get Classification Person
   *
   */
  getClassificationPersonByPersonType(personType: string): any[] {
    let data = [];
    if (this.isLocalStorageSupported) {
      const pt = personType === '1' ? 'pf' : 'pm';
      const local = this.getItem('cat_classificationPerson');
      let classifications;

      if (local) {
        classifications = JSON.parse(local);
        data = classifications[pt];
      }
    }
    return data;
  }

  // TODO falta agregar expiracion a este catálogo
  /**
   * Gets the contracts.
   *
   * @param personType If PF (1) PM (2)
   */
  getContracts(personType: number): Contract[] {
    if (this.isLocalStorageSupported) {
      const pt = personType === 1 ? 'pf' : 'pm';
      const local = this.getItem('cat_contracts');
      let contracts: ContractsLocal;

      if (local) {
        contracts = JSON.parse(local);
        const newData = contracts[pt].map((item: ContractOnLocalStorage) => {
          return {
            bankAreaTypeId: item.bankAreaTypeId,
            contractTypeId: item.contractTypeId,
            contractType: item.contractType,
          };
        });
        return newData;
      }
    }
    return [];
  }

  // TODO falta agregar expiracion a este catálogo
  /**
   * Gets Subcontracts relatives to a Contract.
   *
   * @param personType If PF (1) PM (2).
   * @param contractId Contract ID to return subcontracts.
   */
  getSubcontracts(personType: number, contractId: number): SubContract[] {
    if (this.isLocalStorageSupported) {
      const pt = personType === 1 ? 'pf' : 'pm';
      const local = this.getItem('cat_contracts');
      let contracts: ContractsLocal;

      if (local) {
        contracts = JSON.parse(local);
        const newArr = contracts[pt].filter((item: ContractOnLocalStorage) => item.contractTypeId === contractId);
        return newArr[0].subcontract;
      }
    }
    return [];
  }

  /**
   * implements the "setItem" from Local Storage
   *
   * @param name  -  the name of the data to be saved
   * @param data  -  the data to be saved.
   */
  private setItem(name: string, data: string): boolean {
    if (this.isLocalStorageSupported) {
      return this.safeSetItem(name, data);
    }
    return false;
  }

  /**
   * implements "getItem" from Local Storage
   *
   * @param name - the name of the key to retrieve from local storage
   */
  private getItem(name: string): string | null {
    let data = null;
    if (this.isLocalStorageSupported) {
      data = this.localStorage.getItem(name);
    }
    return data;
  }

  private removeItem(name: string): void {
    if (this.isLocalStorageSupported) {
      this.localStorage.removeItem(name);
    }
  }

  private getKeyName(idx: number): string | null {
    let ret = null;
    if (this.isLocalStorageSupported) {
      ret = this.localStorage.key(idx);
    }
    return ret;
  }

  get isLocalStorageSupported(): boolean {
    return !!this.localStorage
  }

  private readonly MAX_SIZE_BYTES = 1024 * 1024; // 1MB

  private isUnderSizeLimit(value: string): boolean {
    const sizeBytes = value.length * 2;
    return sizeBytes <= this.MAX_SIZE_BYTES;
  }

  private safeSetItem(key: string, value: string): boolean {
    if (this.SIZE_EXCEPTIONS.has(key)) {
      this.localStorage.setItem(key, value);
      return true;
    }

    if (!this.isUnderSizeLimit(value)) {
      console.warn(`LocalStorage: ${key} excede 1MB, no se guarda`);
      return false;
    }

    this.localStorage.setItem(key, value);
    return true;
  }
}
