import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OptionsValuesListComponent } from './options-values-list.component';

describe('OptionsValuesListComponent', () => {
  let component: OptionsValuesListComponent;
  let fixture: ComponentFixture<OptionsValuesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsValuesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsValuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
