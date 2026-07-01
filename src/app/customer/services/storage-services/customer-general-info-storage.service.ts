import { Injectable, signal } from '@angular/core';
import { CustomerGeneralInfoContract } from '../../models/customer-general-info';
import { CustomerGeneralInfoExecutorSection, CustomerGeneralInfoSection } from '../../models/checkpoints/customer-general-info-checkpoint';

@Injectable({
    providedIn: 'root'
})
export class CustomerGeneralInfoStorageService {

    generalInfoItem = signal<CustomerGeneralInfoSection | null>(null);
    generalInfoContract = signal<CustomerGeneralInfoContract | null>(null);
    testamentarySection = signal<CustomerGeneralInfoExecutorSection | null>(null);

    constructor() { }

    saveGeneralInfo(data: CustomerGeneralInfoSection) {
        // BEAT: Campos ocultos usan valores default
        const beatData = {
            ...data,
            changeOperation: false,          // Default
            showTestamentaries: false,       // Default
            isOwnAccountAct: false,          // Default (actúa por su cuenta)
            haveResourceProvider: false,     // Default (sin proveedor)
            operatesChanges: false,          // Default for check
            acting: false,                   // Default (actúa por su cuenta)
            hasSupplier: false               // Default (sin proveedor)
        };
        this.generalInfoItem.set(beatData);
    }

    setGeneralInfoItem(item: CustomerGeneralInfoSection) {
        this.saveGeneralInfo(item);
    }

    clearGeneralInfoItem() {
        this.generalInfoItem.set(null);
    }

    setFullSectionSingal(data: {
        contractSection: CustomerGeneralInfoContract | null,
        executorSection: CustomerGeneralInfoExecutorSection | null,
        clientSection: CustomerGeneralInfoSection
    }) {
        // BEAT transformation
        const beatClientSection = {
            ...data.clientSection,
            changeOperation: false,
            showTestamentaries: false,
            isOwnAccountAct: false,
            haveResourceProvider: false,
            operatesChanges: false,
            acting: false,
            hasSupplier: false
        };

        this.generalInfoContract.set(data.contractSection);
        this.testamentarySection.set(data.executorSection);
        this.generalInfoItem.set(beatClientSection);
    }

    isSavedInfoFlag(): boolean {
        return !!this.generalInfoItem();
    }
}

export type GeneralInfoStorageService = CustomerGeneralInfoStorageService;


