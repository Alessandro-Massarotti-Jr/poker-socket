import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scrum-poker-card-component',
  imports: [NgClass],
  templateUrl: './scrum-poker-card-component.html',
  styleUrl: './scrum-poker-card-component.css',
})
export class ScrumPokerCardComponent {
  @Input() text: string = '';
  @Input() selected: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hidden: boolean = true;
  @Input() onClick: Function = () => {};
}
