import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginComponent } from './origin.component';

describe('OriginComponent', () => {
  let component: OriginComponent;
  let fixture: ComponentFixture<OriginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OriginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
