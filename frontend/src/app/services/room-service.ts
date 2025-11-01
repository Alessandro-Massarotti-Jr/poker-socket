import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../interfaces/room';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private socket: Socket;
  private roomSubject = new BehaviorSubject<Room>({ id: '', hidden: true, participants: [] });
  public room$ = this.roomSubject.asObservable();

  public participantSubject = new BehaviorSubject<{ id: string; name: string }>({
    id: '',
    name: '',
  });
  public participant$ = this.participantSubject.asObservable();

  constructor(private router: Router) {
    this.socket = io(environment.apiUrl, { transports: ['websocket'] });

    this.socket.on('connect', () => {
      this.participantSubject.next({ ...this.participantSubject.value, id: this.socket.id! });
    });

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

    this.socket.on('room:left', ({ room }) => {
      this.roomSubject.next(room);
    });

    this.socket.on('room:votesHidden', ({ room }) => {
      this.roomSubject.next(room);
    });

    this.socket.on('room:votesShowed', ({ room }) => {
      this.roomSubject.next(room);
    });

    this.socket.on('connect_error', () => {
      this.router.navigate(['/'], { state: { errorMessage: 'Error when connecting with server' } });
    });

    this.socket.on('error', () => {
      this.router.navigate(['/'], {
        state: { errorMessage: 'Unexpected error with server connection' },
      });
    });

    this.socket.on('aplication:error', (error) => {
      this.router.navigate(['/'], {
        state: { errorMessage: `Oops, some error happened: ${error.message}` },
      });
    });

    this.socket.on('disconnect', () => {
      this.router.navigate(['/'], {
        state: { errorMessage: 'Client disconected' },
      });
    });

    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  createRoom({ participantName }: { participantName: string }) {
    this.setParticipantName({ participantName });
    this.socket.emit('room:create', { participantName });
  }
  joinRoom({ participantName, roomId }: { participantName: string; roomId: string }) {
    this.setParticipantName({ participantName });
    this.socket.emit('room:join', { participantName, roomId });
  }
  voteRoom({ vote, roomId }: { vote: string; roomId: string }) {
    this.socket.emit('room:vote', { vote, roomId });
  }
  clearRoomVotes({ roomId }: { roomId: string }) {
    this.socket.emit('room:clearVotes', { roomId });
  }

  setParticipantName({ participantName }: { participantName: string }) {
    this.participantSubject.next({ ...this.participantSubject.value, name: participantName });
  }

  hideRoomVotes({ roomId }: { roomId: string }) {
    this.socket.emit('room:votesHide', { roomId });
  }

  showRoomVotes({ roomId }: { roomId: string }) {
    this.socket.emit('room:votesShow', { roomId });
  }
}
