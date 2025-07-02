import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MirTooltipComponent } from './mir-tooltip.component';

describe('MirTooltipComponent', () => {
  let component: MirTooltipComponent;
  let fixture: ComponentFixture<MirTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MirTooltipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MirTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
