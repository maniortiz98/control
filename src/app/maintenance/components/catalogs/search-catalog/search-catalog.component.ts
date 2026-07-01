import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogsService } from '../../../../shared/services/catalogs.service';

@Component({
  selector: 'app-search-catalog',
  standalone: false,
  templateUrl: './search-catalog.component.html',
  styleUrl: './search-catalog.component.scss'
})
export class SearchCatalogComponent {
  elementNumber = 0;
  private readonly router = inject(Router);
  private readonly catalogsService = inject(CatalogsService);

  ngOnInit() {
    this.catalogsService.getStrategiesEquity().subscribe((data: any) => {
      this.elementNumber = data.length;
    });
  }

  openCatalog(type: string): void {
    console.log('redireccionando')
    if(type === 'equity'){
      this.router.navigate(['/maintenance/catalogs/equity-strategy'])
    }
  }
}
