import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosLogin } from './usuarios-login';

describe('UsuariosLogin', () => {
  let component: UsuariosLogin;
  let fixture: ComponentFixture<UsuariosLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
