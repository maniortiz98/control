import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MultipleCatalogComponent } from './multiple-catalog.component';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';

describe('MultipleCatalogComponent', () => {
  let component: MultipleCatalogComponent;
  let fixture: ComponentFixture<MultipleCatalogComponent>;

  const fakeCatalog = [
    { cveStrategy: '1', description: 'Item 1' },
    { cveStrategy: '2', description: 'Item 2' },
    { cveStrategy: '3', description: 'Item 3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultipleCatalogComponent],
      imports: [
        CoreModule,
        SharedModule,
        ReactiveFormsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleCatalogComponent);
    component = fixture.componentInstance;

    component.control = new FormControl<string[]>([], { nonNullable: true });

    component.catalog = fakeCatalog as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSelectionChange', () => {
    it('should set value, mark as dirty and touched', () => {
      const setValueSpy = spyOn(component.control, 'setValue').and.callThrough();
      const dirtySpy = spyOn(component.control, 'markAsDirty').and.callThrough();
      const touchedSpy = spyOn(component.control, 'markAsTouched').and.callThrough();

      component.onSelectionChange(['1', '3']);

      expect(setValueSpy).toHaveBeenCalledWith(['1', '3']);
      expect(component.control.value).toEqual(['1', '3']);
      expect(dirtySpy).toHaveBeenCalled();
      expect(touchedSpy).toHaveBeenCalled();
      expect(component.control.dirty).toBeTrue();
      expect(component.control.touched).toBeTrue();
    });
  });

  describe('selectedItems getter', () => {
    it('should return items that match cveStrategy in control value', () => {
      component.control.setValue(['2', '3']);

      const result = component.selectedItems;

      expect(result.length).toBe(2);
      expect(result.map(x => x.cveStrategy)).toEqual(['2', '3']);
    });

    it('should return empty array when control value is empty', () => {
      component.control.setValue([]);

      const result = component.selectedItems;

      expect(result).toEqual([]);
    });

    it('should not throw and return empty array when control value is null/undefined', () => {
      (component.control as any).setValue(null);

      const result = component.selectedItems;

      expect(result).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should remove the item cveStrategy from control value', () => {
      component.control.setValue(['1', '2', '3']);

      const setValueSpy = spyOn(component.control, 'setValue').and.callThrough();

      component.remove({ cveStrategy: '2' });

      expect(setValueSpy).toHaveBeenCalledWith(['1', '3']);
      expect(component.control.value).toEqual(['1', '3']);
    });

    it('should do nothing if item cveStrategy does not exist in value', () => {
      component.control.setValue(['1', '3']);

      component.remove({ cveStrategy: '2' });

      expect(component.control.value).toEqual(['1', '3']);
    });

    it('should remove all occurrences if duplicates exist', () => {
      component.control.setValue(['1', '2', '2', '3']);

      component.remove({ cveStrategy: '2' });

      expect(component.control.value).toEqual(['1', '3']);
    });
  });
});
