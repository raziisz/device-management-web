import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CategoryTableComponent } from './components/category-table/category-table.component';

export const routes: Routes = [
  {
    path: 'categories',
    component: CategoryTableComponent,
  },
];
