import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrumPokerCardComponent } from '../../components/scrum-poker-card-component/scrum-poker-card-component';
import { environment } from '../../../environments/environment';
import { RoomService } from '../../services/room-service';
import { Room } from '../../interfaces/room';

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
  public room: Room = { id: '', participants: [] };

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

  setVote(vote: string): Function {
    return () => {
      this.roomService.voteRoom({ roomId: this.roomId, vote });
    };
  }
}
