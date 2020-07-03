import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductToCatalogueComponent } from './product-to-catalogue.component';

describe('ProductToCatalogueComponent', () => {
  let component: ProductToCatalogueComponent;
  let fixture: ComponentFixture<ProductToCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductToCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductToCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
