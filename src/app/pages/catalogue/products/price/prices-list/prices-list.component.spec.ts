import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PricesListComponent } from './prices-list.component';

describe('PricesListComponent', () => {
  let component: PricesListComponent;
  let fixture: ComponentFixture<PricesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PricesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
