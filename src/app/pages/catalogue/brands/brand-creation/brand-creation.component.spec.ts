import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandCreationComponent } from './brand-creation.component';

describe('BrandCreationComponent', () => {
  let component: BrandCreationComponent;
  let fixture: ComponentFixture<BrandCreationComponent>;

  beforeEach(async(() => {
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
