import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private socket: Socket;
  private roomSubject = new BehaviorSubject<{
    id: string;
    participants: {
      id: string;
      name: string;
      vote: string | null;
    }[];
  }>({ id: '', participants: [] });
  public room$ = this.roomSubject.asObservable();

  constructor(private router: Router) {
    this.socket = io(environment.apiUrl);
    this.socket.on('room:created', ({ room }) => {
      this.roomSubject.next(room);
      this.router.navigate([`/room/${room.id}`]);
    });

    this.socket.on('room:joined', ({ room }) => {
      let shoultRedirect = false;
      if (!this.roomSubject.value) {
        shoultRedirect = true;
      }
      this.roomSubject.next(room);
      if (shoultRedirect) {
        this.router.navigate([`/room/${room.id}`]);
      }
    });

    this.socket.on('room:voted', ({ room }) => {
      this.roomSubject.next(room);
    });

    this.socket.on('room:clearedVotes', ({ room }) => {
      this.roomSubject.next(room);
    });

    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  createRoom({ participantName }: { participantName: string }) {
    this.socket.emit('room:create', { participantName });
  }
  joinRoom({ participantName, roomId }: { participantName: string; roomId: string }) {
    this.socket.emit('room:join', { participantName, roomId });
  }
  voteRoom({ vote, roomId }: { vote: string; roomId: string }) {
    this.socket.emit('room:vote', { vote, roomId });
  }
  clearRoomVotes({ roomId }: { roomId: string }) {
    this.socket.emit('room:clearVotes', { roomId });
  }
}
