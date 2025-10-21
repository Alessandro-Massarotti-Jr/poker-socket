import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [ReactiveFormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  createRoom() {
    if (this.form.invalid) return;
    const participantName = this.form.value.name!.trim();

    console.log(participantName);

    this.router.navigate(['/room/1']);
  }
}
