import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  username: string = '';
  apiUsername: string = '';
  apiEmail: string = '';
  apiPassword: string = '';
  newEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showInfo: boolean = false;
  showAlt: boolean = false;
  showAva: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || 'Usuário';
    this.loadUserProfile();
  }

  loadUserProfile() {
    if (this.username) {
      this.apiService.getUserProfile(this.username).subscribe(
        (data: { nome: string; email: string; senha: string }) => {
          this.apiUsername = data.nome;
          this.apiEmail = data.email;
          this.apiPassword = data.senha;
          this.compareUserData();
        },
        (error: HttpErrorResponse) => {
          console.error('Erro ao carregar o perfil do usuário:', error);
          alert('Não foi possível carregar o perfil do usuário.');
        }
      );
    }
  }

  compareUserData() {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');

    if (this.apiUsername === this.username && this.apiEmail === storedEmail && this.apiPassword === storedPassword) {
      console.log('Usuário validado com sucesso!');
    } else {
      console.log('Os dados do usuário não correspondem aos armazenados.');
    }
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  toggleAlt() {
    this.showAlt = !this.showAlt;
  }
  toggleAva() {
    this.showAva = !this.showAva;
  }

  onSubmit() {
    // Validar se as senhas novas coincidem
    if (this.newPassword !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    // Chamar o serviço para atualizar o perfil
    this.apiService.updateUserProfile(this.username, { email: this.newEmail, senha: this.newPassword }).subscribe(
      () => {
        alert('Perfil atualizado com sucesso!');
        this.loadUserProfile(); // Recarregar o perfil para mostrar as novas informações
        this.showAlt = false; // Ocultar a seção de alteração

        // Limpar os campos após a atualização
        this.newEmail = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao atualizar o perfil do usuário:', error);
        alert('Não foi possível atualizar o perfil do usuário.');
      }
    );
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
