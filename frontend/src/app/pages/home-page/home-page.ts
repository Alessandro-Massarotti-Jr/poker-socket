import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomService } from '../../services/room-service';
import { Router } from '@angular/router';
import { Toast } from '../../components/toast/toast';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [ReactiveFormsModule, Toast],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private roomService: RoomService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });

    const navigation = this.router.currentNavigation();
    this.errorMessage = navigation?.extras.state?.['errorMessage'] || null;
  }

  createRoom() {
    if (this.form.invalid) return;
    const participantName = this.form.value.name!.trim();
    this.roomService.createRoom({ participantName });
  }
}
