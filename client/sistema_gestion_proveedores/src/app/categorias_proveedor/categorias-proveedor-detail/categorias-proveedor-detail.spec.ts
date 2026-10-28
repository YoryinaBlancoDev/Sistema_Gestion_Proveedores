import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasProveedorDetail } from './categorias-proveedor-detail';

describe('CategoriasProveedorDetail', () => {
  let component: CategoriasProveedorDetail;
  let fixture: ComponentFixture<CategoriasProveedorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasProveedorDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasProveedorDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
