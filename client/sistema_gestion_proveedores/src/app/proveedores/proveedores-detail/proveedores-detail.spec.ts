import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresDetail } from './proveedores-detail';

describe('ProveedoresDetail', () => {
  let component: ProveedoresDetail;
  let fixture: ComponentFixture<ProveedoresDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedoresDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedoresDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
