import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumPokerCardComponent } from './scrum-poker-card-component';

describe('ScrumPokerCardComponent', () => {
  let component: ScrumPokerCardComponent;
  let fixture: ComponentFixture<ScrumPokerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumPokerCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrumPokerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
