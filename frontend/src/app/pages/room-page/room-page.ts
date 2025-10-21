import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-room-page',
  imports: [],
  templateUrl: './room-page.html',
  styleUrl: './room-page.css',
})
export class RoomPage {
  private roomId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id')!;
  }
}
