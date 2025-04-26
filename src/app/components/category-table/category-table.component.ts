import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category, CategoryColumns } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { PaginationMeta } from '../../models/pagination.model';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-category-table',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css',
})
export class CategoryTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = CategoryColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<Category>();
  columnsSchema: any = CategoryColumns;
  meta: PaginationMeta = {
    currentPage: 1,
    perPage: 15,
    lastPage: 0,
    total: 0,
  };

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories(this.meta.currentPage);
  }

  // ngAfterViewInit(): void {
  //   this.dataSource.paginator = this.paginator;
  // }

  addRow() {
    const newRow: Category = {
      id: 0,
      name: '',
      createdAt: Intl.DateTimeFormat('pt-BR').format(new Date()),
      isEdit: true,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  insertCategory(row: Category): void {
    if (row.id === 0) {
      this.categoryService.addCategory(row).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  loadCategories(page: number = 1): void {
    this.categoryService
      .getCategories(page, this.meta.perPage)
      .subscribe((response) => {
        this.dataSource.data = response.data.map((category) => ({
          ...category,
          createdAt: category.createdAt
            ? Intl.DateTimeFormat('pt-BR').format(new Date(category.createdAt))
            : 'N/A',
          isEdit: false,
        }));
        this.meta = response.meta;
      });
  }

  deleteCategory(id: number): void {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.categoryService.deleteCategory(id).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (category) => category.id !== id
            );
          });
        }
      });
  }

  // onPageChange(event: PageEvent): void {
  //   const newPage = event.pageIndex + 1;
  //   const newPerPage = event.pageSize;
  //   this.meta.perPage = newPerPage;
  //   this.loadCategories(newPage);
  // }
}
