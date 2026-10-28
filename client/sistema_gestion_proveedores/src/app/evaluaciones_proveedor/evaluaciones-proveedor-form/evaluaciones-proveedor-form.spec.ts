import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionesProveedorForm } from './evaluaciones-proveedor-form';

describe('EvaluacionesProveedorForm', () => {
  let component: EvaluacionesProveedorForm;
  let fixture: ComponentFixture<EvaluacionesProveedorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionesProveedorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluacionesProveedorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
