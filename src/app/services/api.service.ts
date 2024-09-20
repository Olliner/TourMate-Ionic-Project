import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000';  // Substitua pelo endereço da sua API

  constructor(private http: HttpClient) {}

  // Função para realizar o cadastro
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Função para realizar o login
  login(credentials: { nome: string; senha: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Função para obter avaliações de um local
  getEvaluations(location: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/evaluations?location=${encodeURIComponent(location)}`);
  }

  // Função para enviar uma avaliação
  submitEvaluation(evaluation: { location: string; comment: string; rating: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/evaluations`, evaluation);
  }
}
