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
    const credentials = {
      nome: this.nome,
      senha: this.senha
    };

    this.apiService.login(credentials).subscribe(
      (response: any) => {
        console.log('Login realizado com sucesso', response);
        
        // Armazena o nome do usuário no localStorage para utilizar em outras partes da aplicação
        localStorage.setItem('username', response.nome);
        
        // Navega para a página de index (ou outra página após o login)
        this.navCtrl.navigateForward('/index');
      },
      (error) => {
        console.error('Erro ao realizar login', error);
        alert('Falha ao fazer login. Verifique suas credenciais.');
      }
    );
  }
}
