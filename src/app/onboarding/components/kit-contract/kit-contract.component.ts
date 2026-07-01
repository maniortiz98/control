import { Component, inject, OnInit, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OnboardingService } from '../../services/onboarding.service';
import { AccountDocumentKit, AccountDocumentKitRequest } from '../../models/account-document-kit';
import { AccountDocumentKitService } from '../../../shared/services/account-document-kit.service';

@Component({
  selector: 'app-kit-contract',
  standalone: false,
  templateUrl: './kit-contract.component.html',
  styleUrl: './kit-contract.component.scss'
})
export class KitContractComponent implements OnInit {

  private readonly documentService = inject(AccountDocumentKitService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly url = environment.api.openText;

  documentsList = signal<AccountDocumentKit[]>([]);

  infoToCopy: string = '';
  response = this.onboardingService.getOnboardingRegister();

  ngOnInit(): void {
    console.log(this.onboardingService.getCurrentInfo());
    console.log(this.onboardingService.getCustomerInitialData());
    this.infoToCopy = this.response['customerId'] || this.onboardingService.getCurrentInfo().clientId || '';

    const body: AccountDocumentKitRequest = {
      personTypeId: this.onboardingService.getCurrentInfo().personType === 'PF' ? '1' : '2',
      subContractTypeId: +this.onboardingService.getCurrentInfo().contractSubtype,
      contractTypeIde: +this.onboardingService.getCurrentInfo().contractType,
    };
    this.documentService.getDocuments(body).subscribe((items: AccountDocumentKit[]) => {
      this.documentsList.set(items);
    });
  }

  openText(): void {
    window.open(this.url, "_blank");
  }

  copyProspectNumber(): void {
    if (this.infoToCopy) {
      navigator.clipboard.writeText(this.infoToCopy).then(() => {
      });
    }
  }

}
