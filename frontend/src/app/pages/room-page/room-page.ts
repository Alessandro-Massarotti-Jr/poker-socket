import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrumPokerCardComponent } from '../../components/scrum-poker-card-component/scrum-poker-card-component';
import { environment } from '../../../environments/environment';
import { RoomService } from '../../services/room-service';

@Component({
  standalone: true,
  selector: 'app-room-page',
  imports: [ScrumPokerCardComponent],
  templateUrl: './room-page.html',
  styleUrl: './room-page.css',
})
export class RoomPage {
  private roomId: string = '';
  public cardOptions: string[] = environment.cardOptions;
  public room: {
    id: string;
    participants: {
      id: string;
      name: string;
      vote: string | null;
    }[];
  } = { id: '', participants: [] };

  constructor(private route: ActivatedRoute, private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id')!;
    this.roomService.room$.subscribe({
      next: (room) => {
        this.room = room;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.roomService.joinRoom({ roomId: this.roomId, participantName: 'sample' });
  }
}
