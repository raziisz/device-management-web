import { Routes } from '@angular/router';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'categories',
    component: CategoryTableComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
