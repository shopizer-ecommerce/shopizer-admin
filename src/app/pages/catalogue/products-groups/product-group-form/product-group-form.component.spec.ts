import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupFormComponent } from './product-group-form.component';

describe('ProductGroupFormComponent', () => {
  let component: ProductGroupFormComponent;
  let fixture: ComponentFixture<ProductGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
