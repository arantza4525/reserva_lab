import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormasScreenComponent } from './normas-screen.component';

describe('NormasScreenComponent', () => {
  let component: NormasScreenComponent;
  let fixture: ComponentFixture<NormasScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NormasScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormasScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
