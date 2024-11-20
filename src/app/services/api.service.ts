import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Definindo interfaces para os dados
interface User {
  nome: string;
  email: string;
  senha: string;
  avatarUrl?: string;
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
  private apiUrl = 'https://crudtourmate-2717319c3c8e.herokuapp.com'; // URL da API

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

  // Função para atualizar a senha do usuário
  updateUserPassword(userId: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/update-password`, {
      senha: newPassword,
      confirmar_senha: confirmPassword
    });
  }

  // Função para atualizar o email do usuário
  updateUserEmail(userId: string, newEmail: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/update-email`, { email: newEmail });
  }
  
  // Função para verificar o email do usuário
  verificarEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/verify-email`, { email });
  }

  // Funções de redefinição de senha
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/request`, { email });
  }

  validateToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/validate-token`, { token });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password/confirm`, {
      token,
      newPassword,
      confirmPassword
    });
  }

  // Função para redefinir a senha com confirmação de e-mail
  redefinirSenha(email: string, novaSenha: string, confirmacaoSenha: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/reset-password`, {
      email: email,
      nova_senha: novaSenha,
      confirmacao_senha: confirmacaoSenha
    });
  }

  // Função para upload de avatar do usuário
  uploadAvatar(userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/users/${userId}/upload-avatar`, formData);
  }

  // Função para exibir o avatar do usuário
  getUserAvatar(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/avatar`).pipe(
      map(response => response.avatar_url)
    );
  }
}
