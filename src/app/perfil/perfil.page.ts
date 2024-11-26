import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userId: string = '';
  apiUsername: string = '';
  apiEmail: string = '';
  newEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showInfo: boolean = false;
  showAltEmail: boolean = false;
  showAltSenha: boolean = false;
  showAva: boolean = false;
  avatarUrl: string = '/assets/images/avatar.png';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    if (!this.userId) {
      this.presentToast('Por favor, faça login novamente.');
      this.router.navigate(['/login']);
      return;
    }
    await this.loadUserProfile();
  }

  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom',
    });
    toast.present();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  async loadUserProfile() {
    const loading = await this.presentLoading('Carregando perfil...');
    this.apiService.getUserProfile(this.userId).subscribe(
      (data) => {
        loading.dismiss();
        this.apiUsername = data.nome;
        this.apiEmail = data.email;

        // Obter avatar
        this.apiService.getUserAvatar(this.userId).subscribe(
          (avatarUrl) => {
            this.avatarUrl = avatarUrl ? `${avatarUrl}?t=${new Date().getTime()}` : '/assets/images/avatar.png';
          },
          (error) => {
            console.error('Erro ao carregar avatar:', error);
            this.avatarUrl = '/assets/images/avatar.png';
          }
        );
      },
      (error: HttpErrorResponse) => {
        loading.dismiss();
        console.error('Erro ao carregar perfil do usuário:', error);
        this.presentToast('Erro ao carregar perfil.');
      }
    );
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  toggleAltEmail() {
    this.showAltEmail = !this.showAltEmail;
  }

  toggleAltSenha() {
    this.showAltSenha = !this.showAltSenha;
  }

  toggleAva() {
    this.showAva = !this.showAva;
  }

  async selectAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const loading = await this.presentLoading('Atualizando avatar...');
        this.apiService.uploadAvatar(this.userId, file).subscribe(
          (response: any) => {
            loading.dismiss();
            if (response && response.avatar_url) {
              this.avatarUrl = `${response.avatar_url}?t=${new Date().getTime()}`;
              this.presentToast('Avatar atualizado com sucesso!');
            } else {
              this.presentToast('Erro ao atualizar avatar.');
            }
          },
          (error: HttpErrorResponse) => {
            loading.dismiss();
            console.error('Erro ao atualizar avatar:', error);
            this.presentToast('Erro ao atualizar avatar.');
          }
        );
      }
    };
    input.click();
  }
  

  async onSubmitEmail() {
    const loading = await this.presentLoading('Atualizando email...');
    this.apiService.updateUserEmail(this.userId, this.newEmail).subscribe(
      () => {
        loading.dismiss();
        this.presentToast('Email atualizado com sucesso!');
        this.loadUserProfile();
        this.newEmail = '';
        this.showAltEmail = false;
      },
      (error: HttpErrorResponse) => {
        loading.dismiss();
        console.error('Erro ao atualizar email:', error);
        this.presentToast('Erro ao atualizar email.');
      }
    );
  }

  async onSubmitSenha() {
    if (this.newPassword !== this.confirmPassword) {
      this.presentToast('As senhas não coincidem.');
      return;
    }

    const loading = await this.presentLoading('Atualizando senha...');
    this.apiService.updateUserPassword(this.userId, this.newPassword, this.confirmPassword).subscribe(
      () => {
        loading.dismiss();
        this.presentToast('Senha atualizada com sucesso!');
        this.newPassword = '';
        this.confirmPassword = '';
        this.showAltSenha = false;
      },
      (error: HttpErrorResponse) => {
        loading.dismiss();
        console.error('Erro ao atualizar senha:', error);
        this.presentToast('Erro ao atualizar senha.');
      }
    );
  }

  logout() {
    localStorage.removeItem('userId');
    this.router.navigate(['/home']);
  }
}
