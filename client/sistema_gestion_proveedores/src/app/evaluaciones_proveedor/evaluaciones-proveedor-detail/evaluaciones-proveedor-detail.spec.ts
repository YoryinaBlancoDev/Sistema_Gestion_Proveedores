import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionesProveedorDetail } from './evaluaciones-proveedor-detail';

describe('EvaluacionesProveedorDetail', () => {
  let component: EvaluacionesProveedorDetail;
  let fixture: ComponentFixture<EvaluacionesProveedorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionesProveedorDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluacionesProveedorDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
