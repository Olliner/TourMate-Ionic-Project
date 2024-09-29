import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nome: string = '';
  senha: string = '';

  constructor(private apiService: ApiService, private navCtrl: NavController) {}

  login() {
    // Cria o objeto de credenciais conforme esperado pelo ApiService
    const credentials = {
      nome: this.nome,
      senha: this.senha
    };

    // Chama o método de login do ApiService com dois parâmetros
    this.apiService.login(this.nome, this.senha).subscribe(
      (response: any) => {
        // Exibe um alerta de sucesso
        alert('Sucesso!');

        // Armazena o nome do usuário no localStorage
        localStorage.setItem('username', response.nome);
        localStorage.setItem('userId', response.id); // Armazene o ID do usuário, se disponível

        // Redireciona para a página de index
        this.navCtrl.navigateForward('/index');
      },
      (error) => {
        // Exibe erro no console e alerta de falha no login
        console.error('Erro ao realizar login', error);
        alert('Falha no login! Verifique suas credenciais.');
      }
    );
  }
}
