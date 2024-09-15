import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';  // Certifique-se de ajustar o caminho
import { NavController } from '@ionic/angular';

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

  constructor(private apiService: ApiService, private navCtrl: NavController) {}

  register() {
    if (this.senha !== this.confirmarSenha) {
      console.error('As senhas não coincidem');
      return;
    }

    const userData = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
    };

    this.apiService.register(userData).subscribe(
      (response) => {
        console.log('Cadastro realizado com sucesso', response);
        this.navCtrl.navigateForward('/home');  // Redireciona após o cadastro
      },
      (error) => {
        console.error('Erro ao realizar o cadastro', error);
      }
    );
  }
}
