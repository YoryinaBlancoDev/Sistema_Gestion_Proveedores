import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasProveedorAll } from './categorias-proveedor-all';

describe('CategoriasProveedorAll', () => {
  let component: CategoriasProveedorAll;
  let fixture: ComponentFixture<CategoriasProveedorAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasProveedorAll],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasProveedorAll);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
