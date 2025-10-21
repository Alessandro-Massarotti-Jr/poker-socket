import { Routes } from '@angular/router';
import { BaseLayout } from './layouts/base-layout/base-layout';
import { HomePage } from './pages/home-page/home-page';
import { RoomPage } from './pages/room-page/room-page';

export const routes: Routes = [
  {
    path: '',
    component: BaseLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'room/:id', component: RoomPage },
    ],
  },
];
