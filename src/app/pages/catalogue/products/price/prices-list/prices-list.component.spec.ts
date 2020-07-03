import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesListComponent } from './prices-list.component';

describe('PricesListComponent', () => {
  let component: PricesListComponent;
  let fixture: ComponentFixture<PricesListComponent>;

  beforeEach(async(() => {
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
