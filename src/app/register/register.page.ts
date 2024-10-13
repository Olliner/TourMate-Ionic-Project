import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';

  constructor(
    private apiService: ApiService, 
    private navCtrl: NavController, 
    private toastCtrl: ToastController  // Adicionando o ToastController
  ) {}

  // Função para exibir uma mensagem Toast
  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });
    toast.present();
  }

  // Função de cadastro
  register() {
    if (this.senha !== this.confirmarSenha) {
      this.presentToast('As senhas não coincidem!');
      return;
    }

    // Dados do usuário a serem enviados para o cadastro
    const userData = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
    };

    // Chamada para a API de cadastro
    this.apiService.register(userData).subscribe(
      (response) => {
        this.presentToast('Cadastro realizado com sucesso!');
        this.navCtrl.navigateForward('/home');  // Redireciona após o cadastro
      },
      (error) => {
        console.error('Erro ao realizar o cadastro', error);
        this.presentToast('Erro ao realizar o cadastro.');
      }
    );
  }
}
