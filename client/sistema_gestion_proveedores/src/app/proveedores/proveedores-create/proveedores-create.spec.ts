import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresCreate } from './proveedores-create';

describe('ProveedoresCreate', () => {
  let component: ProveedoresCreate;
  let fixture: ComponentFixture<ProveedoresCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedoresCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedoresCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
