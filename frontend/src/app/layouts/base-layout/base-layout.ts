import { Component } from '@angular/core';
import { BaseFooterComponent } from '../../components/base-footer-component/base-footer-component';
import { BaseHeaderComponent } from '../../components/base-header-component/base-header-component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-base-layout',
  imports: [RouterOutlet, BaseFooterComponent, BaseHeaderComponent],
  templateUrl: './base-layout.html',
  styleUrl: './base-layout.css',
})
export class BaseLayout {}
