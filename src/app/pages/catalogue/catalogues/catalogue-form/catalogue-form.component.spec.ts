import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueFormComponent } from './catalogue-form.component';

describe('CatalogueFormComponent', () => {
  let component: CatalogueFormComponent;
  let fixture: ComponentFixture<CatalogueFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
