import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DeviceColumns, Device } from '../../models/device.model';
import { Category, ColumnSchema } from '../../models/category.model';
import { PaginationMeta } from '../../models/pagination.model';
import { DeviceService } from '../../services/device.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CategoryService } from '../../services/category.service';
import { debounceTime, finalize } from 'rxjs';

@Component({
  selector: 'app-device-table',
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
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './device-table.component.html',
  styleUrl: './device-table.component.css',
})
export class DeviceTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = DeviceColumns.map((col) => col.key);
  dataSource = new MatTableDataSource<Device>();
  columnsSchema: ColumnSchema[] = DeviceColumns;
  categories: Category[] = [];
  meta: PaginationMeta = {
    currentPage: 1,
    perPage: 15,
    lastPage: 0,
    total: 0,
  };
  isLoading: boolean = false;

  constructor(
    private deviceService: DeviceService,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDevices(this.meta.currentPage);
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (allCategories) => {
        this.categories = allCategories.map((category) => ({
          ...category,
          createdAt: category.createdAt
            ? Intl.DateTimeFormat('pt-BR').format(new Date(category.createdAt))
            : 'N/A',
          isEdit: false,
        }));
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  addRow() {
    const newRow: Device = {
      id: Date.now(),
      partNumber: '',
      color: '',
      isEdit: true,
    };

    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(device: Device) {
    this.dataSource.data = this.dataSource.data.filter(
      (row) => row.id !== device.id
    );
  }

  insertDevice(row: Device): void {
    if (row.id) {
      this.isLoading = true;
      this.deviceService
        .addDevice(row)
        .pipe(
          debounceTime(500),
          finalize(() => (this.isLoading = false))
        )
        .subscribe({
          next: () => {
            this.toastService.showSuccess(
              'Dispositivo adicionado com sucesso!'
            );
            this.loadDevices(this.meta.currentPage);
          },
          error: (err) => {
            const { error } = err;
            this.isLoading = false;
            if (error) {
              this.toastService.showError(error.message);
              return;
            }
            this.toastService.showError('Erro ao adicionar dispositivo');
          },
        });
    }
  }

  loadDevices(page: number = 1): void {
    this.isLoading = true;
    this.deviceService
      .getDevices(page, this.meta.perPage)
      .pipe(
        debounceTime(500),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data.map((device) => ({
            ...device,
            isEdit: false,
          }));
          this.meta = response.meta;
          this.isLoading = false;
          if (
            this.meta.currentPage > this.meta.lastPage &&
            this.meta.lastPage > 0
          ) {
            this.loadDevices();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toastService.showError(
            'Ocorreu um problema ao carregar dispositivos, tente novamente mais tarde.'
          );
          console.error('Erro ao carregar dispositivos:', error);
        },
      });
  }

  deleteDevice(id: number): void {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.isLoading = true;
          this.deviceService
            .deleteDevice(id)
            .pipe(
              debounceTime(500),
              finalize(() => (this.isLoading = false))
            )
            .subscribe({
              next: () => {
                this.toastService.showSuccess(
                  'Dispositivo excluído com sucesso!'
                );
                this.loadDevices(this.meta.currentPage);
              },
              error: (err) => {
                this.isLoading = false;
                console.error('Erro ao excluir dispositivo:', err);
                const { error } = err;
                this.isLoading = false;
                if (error) {
                  this.toastService.showError(error.message);
                  return;
                }
                this.toastService.showError('Erro ao excluir dispositivo');
              },
            });
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.meta.currentPage =
      event.pageSize !== this.meta.perPage ? 1 : event.pageIndex + 1;

    this.meta.perPage = event.pageSize;
    this.loadDevices(this.meta.currentPage);
  }

  isFormInvalid(element: any): boolean {
    return this.columnsSchema.some((col: ColumnSchema) => {
      if (col.required) {
        const fieldValue = element[col.key];
        if (col.key === 'category') {
          return !fieldValue || fieldValue?.id === null;
        }
        return !fieldValue || fieldValue.trim() === '';
      }
      return false;
    });
  }

  validateInput(event: KeyboardEvent, key: string) {
    if (key === 'color') {
      const allowedRegex = /^[a-zA-ZÀ-ÿ\s]*$/;
      const inputChar = event.key;

      if (!allowedRegex.test(inputChar) && event.key.length === 1) {
        event.preventDefault();
      }
    }

    if (key === 'partNumber') {
      const allowedRegex = /^[0-9]*$/;
      const inputChar = event.key;
      if (!allowedRegex.test(inputChar) && event.key.length === 1) {
        event.preventDefault();
      }
    }
  }
}
