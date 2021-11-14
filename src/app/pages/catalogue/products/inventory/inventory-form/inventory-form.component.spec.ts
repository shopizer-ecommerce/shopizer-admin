import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InventoryFormComponent } from './inventory-form.component';

describe('InventoryFormComponent', () => {
  let component: InventoryFormComponent;
  let fixture: ComponentFixture<InventoryFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
