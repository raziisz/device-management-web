import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '../models/device.model';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = 'http://localhost:3000/devices'; // Substitua pela URL da sua API

  constructor(private http: HttpClient) {}

  getDevices(
    page: number = 1,
    perPage: number = 15
  ): Observable<PaginatedResponse<Device>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    return this.http.get<PaginatedResponse<Device>>(this.apiUrl, { params });
  }

  addDevice(device: Device): Observable<Device> {
    return this.http.post<Device>(this.apiUrl, {
      partNumber: device.partNumber,
      color: device.color,
      categoryId: device.category.id,
    });
  }

  deleteDevice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
