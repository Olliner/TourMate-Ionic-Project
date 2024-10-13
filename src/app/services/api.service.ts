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
  private apiUrl = 'https://crudtourmate-2717319c3c8e.herokuapp.com'; // Removi o espaço extra no final

  constructor(private http: HttpClient) {}

  // Função para realizar o cadastro
  register(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  // Função para realizar o login
  login(nome: string, senha: string): Observable<any> {
    const credentials = { nome, senha };
    return this.http.post(`${this.apiUrl}/users/login`, credentials);
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
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  // Função para atualizar os dados do usuário
  updateUserProfile(username: string, userData: Partial<{ email: string; senha: string }>): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${username}`, userData);
  }  

  // Função para verificar o email do usuário
  verificarEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/verify-email`, { email });
  }

  // Função para redefinir a senha
  redefinirSenha(email: string, novaSenha: string, confirmacaoSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      email: email,
      nova_senha: novaSenha,
      confirmacao_senha: confirmacaoSenha
    });
  }
}
