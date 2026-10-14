import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasScreenComponent } from './preguntas-screen.component';

describe('PreguntasScreenComponent', () => {
  let component: PreguntasScreenComponent;
  let fixture: ComponentFixture<PreguntasScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreguntasScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntasScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
