import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrandDetailsComponent } from './brand-details.component';

describe('BrandDetailsComponent', () => {
  let component: BrandDetailsComponent;
  let fixture: ComponentFixture<BrandDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
