import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttributeFormComponent } from './attribute-form.component';

describe('AttributeFormComponent', () => {
  let component: AttributeFormComponent;
  let fixture: ComponentFixture<AttributeFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
