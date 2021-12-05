import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CataloguesListComponent } from './catalogues-list.component';

describe('CataloguesListComponent', () => {
  let component: CataloguesListComponent;
  let fixture: ComponentFixture<CataloguesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CataloguesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CataloguesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
