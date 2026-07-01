import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { SearchComponent } from './components/search/search.component';
import { AdvisorsTransferComponent } from './components/advisors-transfer/advisors-transfer.component';
import { ActiwebComponent } from './components/actiweb/actiweb.component';
import { InternTrustComponent } from './components/trust/intern-trust/intern-trust.component';
import { RequestTrustComponent } from './components/trust/request-trust/request-trust.component';
import { TrustComponent } from './components/trust/trust.component';
import { ModalTrustComponent } from './components/trust/modal-trust/modal-trust.component';
import { SectionTrustComponent } from './components/trust/section-trust/section-trust.component';
import { EquityStrategyComponent } from './components/catalogs/equity-strategy/equity-strategy.component';
import { EquityModalComponent } from './components/catalogs/equity-strategy/equity-modal/equity-modal.component';
import { SearchCatalogComponent } from './components/catalogs/search-catalog/search-catalog.component';

import { DomiciliosComponent } from './components/catalogs/domicilios/domicilios.component';
import { AccesorComponent } from './components/catalogs/accesor/accesor.component';
import { AnalistaComponent } from './components/catalogs/analista/analista.component';
import { AnalistaPldComponent } from './components/catalogs/analista-pld/analista-pld.component';
import { SubgerenteComponent } from './components/catalogs/subgerente/subgerente.component';
import { AdministratorComponent } from './components/catalogs/administrator.component';


@NgModule({
  declarations: [
    SearchComponent,
    AdvisorsTransferComponent,
    ActiwebComponent,
    InternTrustComponent,
    RequestTrustComponent,
    TrustComponent,
    ModalTrustComponent,
    SectionTrustComponent,
    DomiciliosComponent,
    AccesorComponent,
    AnalistaComponent,
    AnalistaPldComponent,
    SubgerenteComponent,
    AdministratorComponent,
    EquityStrategyComponent,
    EquityModalComponent,
    SearchCatalogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaintenanceRoutingModule,
    CoreModule,
    ReactiveFormsModule,
  ]
})
export class MaintenanceModule { }
