import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransferlistboxComponent } from './transferlistbox.component';

describe('TransferlistboxComponent', () => {
  let component: TransferlistboxComponent;
  let fixture: ComponentFixture<TransferlistboxComponent>;

  beforeEach(waitForAsync(() => {
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
