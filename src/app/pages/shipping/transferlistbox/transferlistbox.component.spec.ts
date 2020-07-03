import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferlistboxComponent } from './transferlistbox.component';

describe('TransferlistboxComponent', () => {
  let component: TransferlistboxComponent;
  let fixture: ComponentFixture<TransferlistboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferlistboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferlistboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
