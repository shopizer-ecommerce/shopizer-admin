import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrandCreationComponent } from './brand-creation.component';

describe('BrandCreationComponent', () => {
  let component: BrandCreationComponent;
  let fixture: ComponentFixture<BrandCreationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
