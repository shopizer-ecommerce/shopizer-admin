import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CataloguesComponent } from './catalogues.component';

describe('CataloguesComponent', () => {
  let component: CataloguesComponent;
  let fixture: ComponentFixture<CataloguesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CataloguesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CataloguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
