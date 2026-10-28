import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  private urlAPI: string = environment.apiURL;

  constructor(private http: HttpClient) {}

  // Listar
  list<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.urlAPI}/${endpoint}`);
  }

  // Obtener recurso sin ID (para Dashboard)
  getByEndpoint<T>(endpoint: string): Observable<T> {
  return this.http.get<T>(
    `${this.urlAPI}/${endpoint}`
  );
}

  // Obtener por ID
  get<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.urlAPI}/${endpoint}/${id}`);
  }

  // Crear
  create<T>(endpoint: string, objCreate: T): Observable<T> {
    return this.http.post<T>(
      `${this.urlAPI}/${endpoint}`,
      objCreate
    );
  }

  // Actualizar
  update<T>(
    endpoint: string,
    id: number | string,
    objUpdate: Partial<T>
  ): Observable<T> {
    return this.http.put<T>(
      `${this.urlAPI}/${endpoint}/${id}`,
      objUpdate
    );
  }
}