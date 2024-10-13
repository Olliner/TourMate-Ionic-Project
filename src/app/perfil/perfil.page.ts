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
  username: string = '';
  apiUsername: string = '';
  apiEmail: string = '';
  apiPassword: string = '';
  newEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showInfo: boolean = false;
  showAltEmail: boolean = false;
  showAltSenha: boolean = false;
  showAva: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.username = localStorage.getItem('username') || 'Usuário';
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
    this.apiService.getUserProfile(this.username).subscribe(
      (data: { nome: string; email: string; senha: string }) => {
        loading.dismiss();
        this.apiUsername = data.nome;
        this.apiEmail = data.email;
        this.apiPassword = data.senha;
      },
      (error: HttpErrorResponse) => {
        loading.dismiss();
        console.error('Erro ao carregar o perfil do usuário:', error);
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

  async onSubmitEmail() {
    const loading = await this.presentLoading('Atualizando email...');
    this.apiService.updateUserProfile(this.username, { email: this.newEmail }).subscribe(
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
    this.apiService.updateUserProfile(this.username, { senha: this.newPassword }).subscribe(
      () => {
        loading.dismiss();
        this.presentToast('Senha atualizada com sucesso!');
        this.loadUserProfile();
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
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('userId');
    this.router.navigate(['/home']);
  }
}
