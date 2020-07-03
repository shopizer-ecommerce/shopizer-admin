import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDetailsComponent } from './inventory-details.component';

describe('InventoryDetailsComponent', () => {
  let component: InventoryDetailsComponent;
  let fixture: ComponentFixture<InventoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
