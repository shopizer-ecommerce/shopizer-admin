import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailerComponent } from './retailer.component';

describe('RetailerComponent', () => {
  let component: RetailerComponent;
  let fixture: ComponentFixture<RetailerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
