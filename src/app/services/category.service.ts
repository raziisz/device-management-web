import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, expand, reduce, EMPTY } from 'rxjs';
import { Category } from '../models/category.model';
import { PaginatedResponse } from '../models/pagination.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

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

  getAllCategories(perPage: number = 100): Observable<Category[]> {
    return this.getPage(1, perPage).pipe(
      expand((response) => {
        const nextPage = response.meta.currentPage + 1;
        return nextPage <= response.meta.lastPage
          ? this.getPage(nextPage, perPage)
          : EMPTY;
      }),
      reduce((acc: Category[], response) => acc.concat(response.data), [])
    );
  }

  private getPage(
    page: number,
    perPage: number
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
