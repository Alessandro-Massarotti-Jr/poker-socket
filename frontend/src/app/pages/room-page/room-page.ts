import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrumPokerCardComponent } from '../../components/scrum-poker-card-component/scrum-poker-card-component';
import { environment } from '../../../environments/environment';
import { RoomService } from '../../services/room-service';
import { Room } from '../../interfaces/room';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-room-page',
  imports: [ReactiveFormsModule, ScrumPokerCardComponent],
  templateUrl: './room-page.html',
  styleUrl: './room-page.css',
})
export class RoomPage {
  private roomId: string = '';
  public cardOptions: string[] = environment.cardOptions;
  public room: Room = { id: '', participants: [] };
  public participant: { id: string; name: string } = { id: '', name: '' };

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

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

    this.roomService.participant$.subscribe({
      next: (participant) => {
        this.participant = participant;
      },
      error: (error) => {
        console.error(error);
      },
    });

    if (this.participant.name) {
      this.roomService.joinRoom({ roomId: this.roomId, participantName: this.participant.name });
    }
  }

  setVote(vote: string): Function {
    return () => {
      this.roomService.voteRoom({ roomId: this.roomId, vote });
    };
  }

  joinRoom() {
    if (this.form.invalid) return;
    const participantName = this.form.value.name!.trim();
    this.roomService.joinRoom({ roomId: this.roomId, participantName: participantName });
  }
}
