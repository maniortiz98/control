import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingChangesGuard } from '../core/guards/pending-changes.guard';

import { CustomerNewCustomerComponent } from './components/new-customer/customer-new-customer.component';
import { CustomerFirstDataComponent } from './components/first-data/customer-first-data.component';
import { CustomerContactInfoComponent } from './components/contact-info/customer-contact-info.component';
import { CustomerSearchCustomerV2Component } from './components/search-customer-v2/customer-search-customer-v2.component';
import { CustomerGeneralInfoComponent } from './components/general-info/customer-general-info.component';
import { CustomerAddressComponent } from './components/address/customer-address.component';

import { CustomerTaxInfoComponent } from './components/tax-info/customer-tax-info.component';
import { CustomerFinalizationComponent } from './components/finalization/customer-finalization.component';
import { CustomerPpeInfoComponent } from './components/ppe-info/customer-ppe-info.component';

// Resolvers
import { CustomerGetSectionDataPpeResolver } from './resolvers/customer-get-section-data-ppe.resolver';
import { CustomerGetSectionDataAddressResolver } from './resolvers/customer-get-section-data-address.resolver';
import { AdvisorCheckGuard } from '../core/guards/advisor-check.guard';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'finalization',
                component: CustomerFinalizationComponent,
            },
            {
                path: 'new-contract',
                component: CustomerNewCustomerComponent,
                canActivate: [AdvisorCheckGuard],
                children: [
                    {
                        path: 'customer-info',
                        component: CustomerFirstDataComponent,
                        canDeactivate: [PendingChangesGuard]
                    },
                    {
                        path: 'contact-info',
                        component: CustomerContactInfoComponent,
                        canDeactivate: [PendingChangesGuard]
                    },
                    {
                        path: 'ppe-info',
                        resolve: {
                            sectionData: CustomerGetSectionDataPpeResolver
                        },
                        component: CustomerPpeInfoComponent,
                        canDeactivate: [PendingChangesGuard],
                    },
                    {
                        path: 'general-info',
                        component: CustomerGeneralInfoComponent,
                        canDeactivate: [PendingChangesGuard]
                    },
                    {
                        path: 'address',
                        component: CustomerAddressComponent,
                        canDeactivate: [PendingChangesGuard],
                        resolve: {
                            sectionData: CustomerGetSectionDataAddressResolver
                        }
                    },

                    {
                        path: 'tax-info',
                        component: CustomerTaxInfoComponent,
                        canDeactivate: [PendingChangesGuard]
                    },
                    {
                        path: '',
                        redirectTo: 'customer-info',
                        pathMatch: 'full'
                    },
                    {
                        path: '**',
                        redirectTo: 'customer-info',
                        pathMatch: 'full'
                    },
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }







