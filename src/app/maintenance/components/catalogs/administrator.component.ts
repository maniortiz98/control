import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-administrator',
  standalone: false,
  templateUrl: './administrator.component.html',
  styleUrl: './administrator.component.scss'
})
export class AdministratorComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly menuItems: CatalogMenuItem[] = [
    {
      id: 'catalogs',
      label: 'Gestión de Catálogos',
      description: 'Administra usuarios y catálogos.',
      route: 'search',
      icon: 'view_list',
      color: 'blue'
    },
    {
      id: 'domicilios',
      label: 'Domicilios',
      description: 'Administra y consulta los domicilios registrados.',
      route: 'domicilios',
      icon: 'location_on',
      color: 'blue'
    },
    {
      id: 'asesor',
      label: 'Asesor',
      description: 'CRUD de asesores.',
      route: 'asesor',
      icon: 'person',
      color: 'blue'
    },
    {
      id: 'analista',
      label: 'Analista',
      description: 'CRUD de analistas.',
      route: 'analista',
      icon: 'person_search',
      color: 'blue'
    },
    {
      id: 'analista-pld',
      label: 'Analista PLD',
      description: 'CRUD de analistas PLD.',
      route: 'analista-pld',
      icon: 'verified_user',
      color: 'blue'
    },
    {
      id: 'subgerente',
      label: 'Subgerente',
      description: 'CRUD de subgerentes.',
      route: 'subgerente',
      icon: 'manage_accounts',
      color: 'blue'
    }
  ];

  selectedId: string = this.menuItems[0].id;

  ngOnInit(): void {
    this.updateSelectedFromRoute();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateSelectedFromRoute();
      }
    });
  }

  select(item: CatalogMenuItem): void {
    this.selectedId = item.id;
    if (item.route) {
      this.router.navigate([item.route], { relativeTo: this.route });
    }
  }

  private updateSelectedFromRoute(): void {
    const child = this.route.firstChild;
    const path = child?.snapshot.routeConfig?.path;

    switch (path) {
      case 'search':
      case 'equity-strategy':
        this.selectedId = 'catalogs';
        break;
      case 'domicilios':
        this.selectedId = 'domicilios';
        break;
      case 'asesor':
        this.selectedId = 'asesor';
        break;
      case 'analista':
        this.selectedId = 'analista';
        break;
      case 'analista-pld':
        this.selectedId = 'analista-pld';
        break;
      case 'subgerente':
        this.selectedId = 'subgerente';
        break;
      default:
        this.selectedId = this.menuItems[0].id;
        break;
    }
  }

}

interface CatalogMenuItem {
  id: string;
  label: string;
  description?: string;
  route?: string;
  badge?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | string;
}
