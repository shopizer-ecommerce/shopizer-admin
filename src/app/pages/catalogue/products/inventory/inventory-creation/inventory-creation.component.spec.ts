import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCreationComponent } from './inventory-creation.component';

describe('InventoryCreationComponent', () => {
  let component: InventoryCreationComponent;
  let fixture: ComponentFixture<InventoryCreationComponent>;

  beforeEach(async(() => {
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
