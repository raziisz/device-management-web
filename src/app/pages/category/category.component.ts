import { Component } from '@angular/core';
import { CategoryTableComponent } from '../../components/category-table/category-table.component';

@Component({
  selector: 'app-category',
  imports: [CategoryTableComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {}
