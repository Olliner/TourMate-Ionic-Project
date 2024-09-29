import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definindo interfaces para os dados
interface User {
  nome: string;
  email: string;
  senha: string;
}

interface Evaluation {
  location: string;
  comment: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://crudtourmate-2717319c3c8e.herokuapp.com'; // URL da sua API

  constructor(private http: HttpClient) {}

  // Função para realizar o cadastro
  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Função para realizar o login
  login(nome: string, senha: string): Observable<any> {
    const credentials = { nome, senha };
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Função para obter avaliações de um local
  getEvaluations(location: string): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/evaluations?location=${encodeURIComponent(location)}`);
  }

  // Função para enviar uma avaliação
  submitEvaluation(evaluation: Evaluation): Observable<any> {
    return this.http.post(`${this.apiUrl}/evaluations`, evaluation);
  }

  // Função para recuperar os dados do usuário logado
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${userId}`); // Endpoint para obter o perfil do usuário
  }

  // Função para atualizar os dados do usuário
  updateUserProfile(username: string, userData: { email: string; senha: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${username}`, userData); // Endpoint para atualizar o perfil do usuário
  }
}
