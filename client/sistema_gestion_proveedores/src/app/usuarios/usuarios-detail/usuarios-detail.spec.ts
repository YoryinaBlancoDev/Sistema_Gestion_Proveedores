import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosDetail } from './usuarios-detail';

describe('UsuariosDetail', () => {
  let component: UsuariosDetail;
  let fixture: ComponentFixture<UsuariosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
