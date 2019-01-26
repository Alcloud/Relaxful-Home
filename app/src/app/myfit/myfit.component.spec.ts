import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyfitComponent } from './myfit.component';

describe('MyfitComponent', () => {
  let component: MyfitComponent;
  let fixture: ComponentFixture<MyfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
