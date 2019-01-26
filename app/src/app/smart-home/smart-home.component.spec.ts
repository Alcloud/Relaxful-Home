import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartHomeComponent } from './smart-home.component';

describe('SmartHomeComponent', () => {
  let component: SmartHomeComponent;
  let fixture: ComponentFixture<SmartHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
