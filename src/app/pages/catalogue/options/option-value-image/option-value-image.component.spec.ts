import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionValueImageComponent } from './option-value-image.component';

describe('OptionValueImageComponent', () => {
  let component: OptionValueImageComponent;
  let fixture: ComponentFixture<OptionValueImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionValueImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionValueImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
