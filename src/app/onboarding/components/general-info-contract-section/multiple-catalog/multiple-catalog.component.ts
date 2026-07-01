import { Component, Input } from '@angular/core';

import { FormControl } from '@angular/forms';
import { EquityStrategyItem } from '../../../../maintenance/models/equity-stategy';

@Component({
  selector: 'app-multiple-catalog',
  standalone: false,
  templateUrl: './multiple-catalog.component.html',
  styleUrl: './multiple-catalog.component.scss'
})
export class MultipleCatalogComponent {

  @Input({ required: true })
  control!: FormControl<any[]>;

  @Input()
  catalog: Array<EquityStrategyItem> = [];

  onSelectionChange(values: string[]) {
    this.control.setValue(values);
    this.control.markAsDirty();
    this.control.markAsTouched();
  }

  get selectedItems() {
    return this.catalog.filter(item =>
      this.control.value?.includes(item.cveStrategy!)
    );
  }

  remove(item: any) {
    const values = this.control.value.filter(
      (v: string) => v !== item.cveStrategy
    );
    this.control.setValue(values);
  }
}
