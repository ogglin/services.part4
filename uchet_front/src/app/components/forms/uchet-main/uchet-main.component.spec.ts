import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UchetMainComponent } from './uchet-main.component';

describe('UchetMainComponent', () => {
  let component: UchetMainComponent;
  let fixture: ComponentFixture<UchetMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UchetMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UchetMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
