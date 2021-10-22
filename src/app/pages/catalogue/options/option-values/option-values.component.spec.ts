import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OptionValuesComponent } from './option-values.component';

describe('OptionValuesComponent', () => {
  let component: OptionValuesComponent;
  let fixture: ComponentFixture<OptionValuesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
