import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

export interface CustomerContract {
    titular: string;
    number: string;
    rfc: string;
    type: string;
    subType: string;
    date: string;
}

export interface CustomerContractData {
    contracts: CustomerContract[];
}

@Component({
    selector: 'app-customer-bank-contract-linking',
    standalone: false,
    templateUrl: './customer-bank-contract-linking.component.html',
    styleUrl: './customer-bank-contract-linking.component.scss'
})
export class CustomerBankContractLinkingComponent implements OnInit {
    @Input() contracts: CustomerContract[] = [];
    @Output() contractSelected = new EventEmitter<CustomerContract>();

    selectedContract: CustomerContract | null = null;

    ngOnInit(): void {
        if (this.contracts.length === 0) {
            this.contracts = [
                {
                    number: '4152-3698-7412-3698',
                    titular: 'Juan Carlos Pérez García',
                    rfc: 'PEGJ850312AB1',
                    subType: 'Cuenta de Cheques',
                    type: 'Activo',
                    date: '15/03/2022'
                },
                {
                    number: '4152-3698-8523-9647',
                    titular: 'María González Hernández',
                    rfc: 'GOHM900215CD2',
                    subType: 'Cuenta Maestra',
                    type: 'Activo',
                    date: '22/07/2021'
                }
            ];
        }
    }

    selectContract(contract: CustomerContract): void {
        this.selectedContract = contract;
        this.contractSelected.emit(contract);
    }
}
