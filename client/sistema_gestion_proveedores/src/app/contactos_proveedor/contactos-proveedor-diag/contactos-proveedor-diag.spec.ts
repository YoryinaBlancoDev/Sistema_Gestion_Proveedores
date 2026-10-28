import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosProveedorDiag } from './contactos-proveedor-diag';

describe('ContactosProveedorDiag', () => {
  let component: ContactosProveedorDiag;
  let fixture: ComponentFixture<ContactosProveedorDiag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactosProveedorDiag],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactosProveedorDiag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
