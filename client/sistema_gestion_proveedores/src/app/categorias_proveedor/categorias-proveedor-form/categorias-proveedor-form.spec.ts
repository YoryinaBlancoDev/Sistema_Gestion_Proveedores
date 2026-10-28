import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasProveedorForm } from './categorias-proveedor-form';

describe('CategoriasProveedorForm', () => {
  let component: CategoriasProveedorForm;
  let fixture: ComponentFixture<CategoriasProveedorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasProveedorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasProveedorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
