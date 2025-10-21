import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private socket: Socket;
  constructor() {
    this.socket = io(environment.apiUrl);
  }

  ngOnInit() {
    this.socket.connect();
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
