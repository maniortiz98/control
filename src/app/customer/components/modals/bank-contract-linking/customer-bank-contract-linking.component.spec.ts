import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerBankContractLinkingComponent, CustomerContract } from './customer-bank-contract-linking.component';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

describe('CustomerBankContractLinkingComponent', () => {
    let component: CustomerBankContractLinkingComponent;
    let fixture: ComponentFixture<CustomerBankContractLinkingComponent>;

    const mockContracts: CustomerContract[] = [
        {
            number: '111444',
            titular: 'Test Holder',
            rfc: 'TEST800101XYZ',
            subType: 'Test Subtype',
            type: 'Activo',
            date: '01/01/2020'
        },
        {
            number: '555888',
            titular: 'Another Holder',
            rfc: 'TEST900101ABC',
            subType: 'Another Subtype',
            type: 'Activo',
            date: '02/02/2021'
        }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomerBankContractLinkingComponent],
            imports: [
                CommonModule,
                MatRadioModule,
                MatButtonModule,
                MatIconModule,
                FormsModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CustomerBankContractLinkingComponent);
        component = fixture.componentInstance;
        component.contracts = mockContracts;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with provided contracts', () => {
        expect(component.contracts).toEqual(mockContracts);
    });

    it('should emit contractSelected when a contract is selected', () => {
        spyOn(component.contractSelected, 'emit');
        const contractSelect = mockContracts[0];
        
        component.selectContract(contractSelect);
        
        expect(component.selectedContract).toBe(contractSelect);
        expect(component.contractSelected.emit).toHaveBeenCalledWith(contractSelect);
    });

    it('should initialize with default contracts if none provided', () => {
        component.contracts = [];
        component.ngOnInit();
        expect(component.contracts.length).toBeGreaterThan(0);
        expect(component.contracts[0].number).toBe('4152-3698-7412-3698');
    });

    it('should render the correct number of contract cards', () => {
        const cards = fixture.debugElement.queryAll(By.css('.contract-card'));
        expect(cards.length).toBe(mockContracts.length);
    });

    it('should display contract details accurately', () => {
        const firstCard = fixture.debugElement.query(By.css('.contract-card'));
        const contractNumber = firstCard.query(By.css('.contract-number')).nativeElement.textContent;
        expect(contractNumber.trim()).toBe(mockContracts[0].number);
    });

    it('should apply "selected" class to the card when clicked', () => {
        const cards = fixture.debugElement.queryAll(By.css('.contract-card'));
        cards[0].triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(component.selectedContract).toBe(mockContracts[0]);
        expect(cards[0].nativeElement.classList.contains('selected')).toBeTrue();
    });

    it('should change selected contract when another card is clicked', () => {
        const cards = fixture.debugElement.queryAll(By.css('.contract-card'));
        
        // Select first card
        cards[0].triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(component.selectedContract).toBe(mockContracts[0]);
        
        // Select second card
        cards[1].triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(component.selectedContract).toBe(mockContracts[1]);
        expect(cards[1].nativeElement.classList.contains('selected')).toBeTrue();
        expect(cards[0].nativeElement.classList.contains('selected')).toBeFalse();
    });
});
