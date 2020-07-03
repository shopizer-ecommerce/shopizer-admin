import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsGroupsComponent } from './products-groups.component';

describe('ProductsGroupsComponent', () => {
  let component: ProductsGroupsComponent;
  let fixture: ComponentFixture<ProductsGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
