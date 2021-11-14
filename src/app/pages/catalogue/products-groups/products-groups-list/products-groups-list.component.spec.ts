import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductsGroupsListComponent } from './products-groups-list.component';

describe('ProductsGroupsListComponent', () => {
  let component: ProductsGroupsListComponent;
  let fixture: ComponentFixture<ProductsGroupsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsGroupsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
