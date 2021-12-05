import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterlistboxComponent } from './filterlistbox.component';

describe('FilterlistboxComponent', () => {
  let component: FilterlistboxComponent;
  let fixture: ComponentFixture<FilterlistboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterlistboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterlistboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
