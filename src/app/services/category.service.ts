import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories'; // Substitua pela URL da sua API

  constructor(private http: HttpClient) {}

  getCategories(
    page: number = 1,
    perPage: number = 15
  ): Observable<PaginatedResponse<Category>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    return this.http.get<PaginatedResponse<Category>>(this.apiUrl, { params });
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, { name: category.name });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
