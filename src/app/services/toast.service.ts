import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, '', {
      duration,
      panelClass: ['success-toast'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, '', {
      duration,
      panelClass: ['error-toast'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
