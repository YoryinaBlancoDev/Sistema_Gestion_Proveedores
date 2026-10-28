import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosProveedorForm } from './contactos-proveedor-form';

describe('ContactosProveedorForm', () => {
  let component: ContactosProveedorForm;
  let fixture: ComponentFixture<ContactosProveedorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactosProveedorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactosProveedorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
