import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavController, ModalController, ToastController } from '@ionic/angular';

enum PasswordResetState {
  RequestEmail = 'RequestEmail',
  ConfirmToken = 'ConfirmToken',
  ResetPassword = 'ResetPassword',
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  PasswordResetState = PasswordResetState;
  passwordResetState: PasswordResetState = PasswordResetState.RequestEmail;

  nome: string = '';
  senha: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';
  isForgotPasswordModalOpen: boolean = false;

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom',
    });
    toast.present();
  }

  login() {
    if (!this.nome || !this.senha) {
      this.presentToast('Por favor, preencha todos os campos.');
      return;
    }
    this.apiService.login(this.nome, this.senha).subscribe(
      (response: any) => {
        if (response && response.id) {
          localStorage.setItem('username', response.nome);
          localStorage.setItem('userId', response.id);
          this.presentToast('Login bem-sucedido!');
          this.navCtrl.navigateForward('/index');
        } else {
          this.presentToast('Erro no login: dados de usuário não encontrados.');
        }
      },
      (error) => {
        console.error('Erro ao realizar login', error);
        this.presentToast('Falha no login! Verifique suas credenciais.');
      }
    );
  }

  openForgotPasswordModal() {
    this.isForgotPasswordModalOpen = true;
    this.passwordResetState = PasswordResetState.RequestEmail;
  }

  closeForgotPasswordModal() {
    this.isForgotPasswordModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.email = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.token = '';
  }

  submitForgotPassword() {
    if (!this.email || !this.validateEmail(this.email)) {
      this.presentToast('Por favor, insira um e-mail válido.');
      return;
    }
    this.apiService.requestPasswordReset(this.email).subscribe(
      () => {
        this.passwordResetState = PasswordResetState.ConfirmToken;
        this.presentToast('Token de confirmação enviado para o seu e-mail.');
      },
      (error) => {
        console.error('Erro ao enviar token de confirmação', error);
        this.presentToast('Erro ao enviar o token de confirmação.');
      }
    );
  }

  confirmToken() {
    if (!this.token) {
      this.presentToast('Por favor, insira o token recebido.');
      return;
    }
    this.apiService.validateToken(this.token).subscribe(
      () => {
        this.passwordResetState = PasswordResetState.ResetPassword;
        this.presentToast('Token confirmado! Agora você pode redefinir sua senha.');
      },
      (error) => {
        console.error('Erro ao confirmar token', error);
        this.presentToast('Token inválido ou expirado.');
      }
    );
  }

  resetPassword() {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      this.presentToast('As senhas não coincidem!');
      return;
    }
    if (this.newPassword.length < 6) {
      this.presentToast('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    this.apiService.resetPassword(this.token, this.newPassword, this.confirmPassword).subscribe(
      () => {
        this.presentToast('Senha redefinida com sucesso!');
        this.closeForgotPasswordModal();
      },
      (error) => {
        console.error('Erro ao redefinir senha', error);
        this.presentToast('Erro ao redefinir senha.');
      }
    );
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(email);
  }
}
