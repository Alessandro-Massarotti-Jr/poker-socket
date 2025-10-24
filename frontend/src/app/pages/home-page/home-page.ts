import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomService } from '../../services/room-service';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [ReactiveFormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  form: FormGroup;

  constructor(private fb: FormBuilder, private roomService: RoomService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  createRoom() {
    if (this.form.invalid) return;
    const participantName = this.form.value.name!.trim();
    this.roomService.createRoom({ participantName });
  }
}
