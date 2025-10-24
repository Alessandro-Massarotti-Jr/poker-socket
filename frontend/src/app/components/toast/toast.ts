import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  @Input() message: string | null = null;
  visible = false;
  private timeoutId: any;

  ngOnChanges() {
    if (this.message) {
      this.show();
    }
  }

  show() {
    this.visible = true;
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.visible = false;
    }, 3000);
  }
}
