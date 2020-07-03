import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductToCategoryComponent } from './product-to-category.component';

describe('ProductToCategoryComponent', () => {
  let component: ProductToCategoryComponent;
  let fixture: ComponentFixture<ProductToCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductToCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductToCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
