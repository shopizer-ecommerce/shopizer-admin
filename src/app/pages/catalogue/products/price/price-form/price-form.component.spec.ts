import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceFormComponent } from './price-form.component';

describe('PriceFormComponent', () => {
  let component: PriceFormComponent;
  let fixture: ComponentFixture<PriceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
