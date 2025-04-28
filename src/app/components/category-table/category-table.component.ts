import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Category,
  CategoryColumns,
  ColumnSchema,
} from '../../models/category.model';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../services/toast.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css',
})
export class CategoryTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = CategoryColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<Category>();
  columnsSchema: ColumnSchema[] = CategoryColumns;
  meta: PaginationMeta = {
    currentPage: 1,
    perPage: 15,
    lastPage: 0,
    total: 0,
  };
  isLoading: boolean = false;
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories(this.meta.currentPage);
  }

  addRow() {
    const newRow: Category = {
      id: Date.now(),
      name: '',
      createdAt: Intl.DateTimeFormat('pt-BR').format(new Date()),
      isEdit: true,
    };

    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(category: Category) {
    this.dataSource.data = this.dataSource.data.filter(
      (row) => row.id !== category.id
    );
  }

  insertCategory(row: Category): void {
    if (row.id) {
      this.isLoading = true;
      this.categoryService.addCategory(row).subscribe({
        next: () => {
          this.toastService.showSuccess('Categoria adicionada com sucesso!');
          this.loadCategories(this.meta.currentPage);
        },
        error: (err) => {
          const { error } = err;
          this.isLoading = false;
          if (error) {
            this.toastService.showError(error.message);
            return;
          }
          this.toastService.showError('Erro ao adicionar categoria');
        },
      });
    }
  }

  loadCategories(page: number = 1): void {
    this.isLoading = true;
    this.categoryService.getCategories(page, this.meta.perPage).subscribe({
      next: (response) => {
        this.dataSource.data = response.data.map((category) => ({
          ...category,
          createdAt: category.createdAt
            ? Intl.DateTimeFormat('pt-BR').format(new Date(category.createdAt))
            : 'N/A',
          isEdit: false,
        }));
        this.meta = response.meta;
        this.isLoading = false;
        if (
          this.meta.currentPage > this.meta.lastPage &&
          this.meta.lastPage > 0
        ) {
          this.loadCategories();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.showError(
          'Ocorreu um problema ao carregar categorias, tente novamente mais tarde.'
        );
        console.error('Erro ao carregar categorias:', error);
      },
    });
  }

  deleteCategory(id: number): void {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.isLoading = true;
          this.categoryService.deleteCategory(id).subscribe({
            next: () => {
              this.toastService.showSuccess('Categoria excluída com sucesso!');
              this.loadCategories(this.meta.currentPage);
            },
            error: (err) => {
              this.isLoading = false;
              console.error('Erro ao excluir categoria:', err);
              const { error } = err;
              this.isLoading = false;
              if (error) {
                this.toastService.showError(error.message);
                return;
              }
              this.toastService.showError('Erro ao excluir categoria');
            },
          });
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.meta.currentPage =
      event.pageSize !== this.meta.perPage ? 1 : event.pageIndex + 1;

    this.meta.perPage = event.pageSize;
    this.loadCategories(this.meta.currentPage);
  }

  isFormInvalid(element: any): boolean {
    return this.columnsSchema.some((col: ColumnSchema) => {
      if (col.required) {
        const fieldValue = element[col.key];
        return !fieldValue || fieldValue.trim() === '';
      }
      return false;
    });
  }
}
