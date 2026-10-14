import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionScreenComponent } from './sesion-screen.component';

describe('SesionScreenComponent', () => {
  let component: SesionScreenComponent;
  let fixture: ComponentFixture<SesionScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SesionScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SesionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
