import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nome: string = '';
  senha: string = '';
  email: string = ''; // Armazena o email para "esqueceu a senha"
  newPassword: string = ''; // Armazena a nova senha
  confirmPassword: string = ''; // Confirmação da nova senha
  emailConfirmed: boolean = false; // Estado que mostra se o email foi confirmado
  isForgotPasswordModalOpen: boolean = false; // Controla o modal de redefinição de senha

  constructor(
    private apiService: ApiService, 
    private navCtrl: NavController, 
    private modalCtrl: ModalController
  ) {}

  // Função de login
  login() {
    const credentials = {
      nome: this.nome,
      senha: this.senha
    };

    this.apiService.login(this.nome, this.senha).subscribe(
      (response: any) => {
        alert('Login bem-sucedido!');
        localStorage.setItem('username', response.nome);
        localStorage.setItem('userId', response.id);
        this.navCtrl.navigateForward('/index');
      },
      (error) => {
        console.error('Erro ao realizar login', error);
        alert('Falha no login! Verifique suas credenciais.');
      }
    );
  }

  // Abre o modal de "Esqueceu Senha?"
  openForgotPasswordModal() {
    this.isForgotPasswordModalOpen = true;
  }

  // Fecha o modal de "Esqueceu Senha?"
  closeForgotPasswordModal() {
    this.isForgotPasswordModalOpen = false;
    this.emailConfirmed = false; // Reseta o estado quando o modal fecha
    this.email = ''; // Limpa o campo de email
    this.newPassword = ''; // Limpa o campo da nova senha
    this.confirmPassword = ''; // Limpa o campo da confirmação da nova senha
  }

  // Função para confirmar o email
  submitForgotPassword() {
    console.log('Verificando email:', this.email);
    
    this.apiService.verificarEmail(this.email).subscribe(
      (response: any) => {
        console.log('Resposta da verificação:', response);
        if (response.message === "E-mail verificado com sucesso!") {
          this.emailConfirmed = true; // Se o email foi confirmado, habilita os campos de nova senha
          alert('Email confirmado! Agora você pode redefinir sua senha.');
        } else {
          alert('Email não encontrado');
        }
      },
      (error) => {
        console.error('Erro ao verificar email', error);
        alert('Erro ao verificar email.');
      }
    );
  }

  // Função para redefinir a senha
  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Chamada para redefinir a senha
    this.apiService.redefinirSenha(this.email, this.newPassword).subscribe(
      (response: any) => {
        // Ajuste para verificar a resposta da API
        if (response.message === "Senha redefinida com sucesso!") {
          alert('Senha redefinida com sucesso!');
          this.closeForgotPasswordModal(); // Fecha o modal após redefinir a senha
        } else {
          alert('Erro ao redefinir senha: ' + response.message);
        }
      },
      (error) => {
        console.error('Erro ao redefinir senha', error);
        // Adiciona uma mensagem de erro mais detalhada
        if (error.error && error.error.message) {
          alert('Erro ao redefinir senha: ' + error.error.message);
        } else {
          alert('Erro ao redefinir senha.');
        }
      }
    );
  }
}
