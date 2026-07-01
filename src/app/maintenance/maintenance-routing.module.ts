import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { AdvisorsTransferComponent } from './components/advisors-transfer/advisors-transfer.component';
import { ActiwebComponent } from './components/actiweb/actiweb.component';
import { InternTrustComponent } from './components/trust/intern-trust/intern-trust.component';
import { PendingChangesGuard } from '../core/guards/pending-changes.guard';
import { RequestTrustComponent } from './components/trust/request-trust/request-trust.component';
import { TrustComponent } from './components/trust/trust.component';
import { CreditDataComponent } from './credit-data/credit-data.component';
import { SearchCatalogComponent } from './components/catalogs/search-catalog/search-catalog.component';
import { EquityStrategyComponent } from './components/catalogs/equity-strategy/equity-strategy.component';
import { GetAdvisorCatalogResolver } from '../onboarding/resolvers/get-advisor.resolver';

import { DomiciliosComponent } from './components/catalogs/domicilios/domicilios.component';
import { AccesorComponent } from './components/catalogs/accesor/accesor.component';
import { AnalistaComponent } from './components/catalogs/analista/analista.component';
import { AnalistaPldComponent } from './components/catalogs/analista-pld/analista-pld.component';
import { SubgerenteComponent } from './components/catalogs/subgerente/subgerente.component';
import { AdministratorComponent } from './components/catalogs/administrator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'advisors-transfer',
    component: AdvisorsTransferComponent,
    resolve: {
      advisorCatalog: GetAdvisorCatalogResolver
    }
  },
  {
    path: 'credit-data',
    component: CreditDataComponent,
  },
  {
    path: 'actiweb',
    component: ActiwebComponent,
  },
  {
    path: 'trust',
    component: TrustComponent,
    children: [
      {
        path: 'intern-trust',
        component: InternTrustComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'request-trust',
        component: RequestTrustComponent
      },
      {
        path: '',
        redirectTo: 'intern-trust',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'catalogs',
    component: AdministratorComponent,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: SearchCatalogComponent,
      },
      {
        path: 'equity-strategy',
        component: EquityStrategyComponent,
      },
      {
        path: 'domicilios',
        component: DomiciliosComponent,
      },
      {
        path: 'asesor',
        component: AccesorComponent,
      },
      {
        path: 'analista',
        component: AnalistaComponent,
      },
      {
        path: 'analista-pld',
        component: AnalistaPldComponent,
      },
      {
        path: 'subgerente',
        component: SubgerenteComponent,
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
