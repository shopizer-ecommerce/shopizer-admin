import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InventoryCreationComponent } from './inventory-creation.component';

describe('InventoryCreationComponent', () => {
  let component: InventoryCreationComponent;
  let fixture: ComponentFixture<InventoryCreationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
