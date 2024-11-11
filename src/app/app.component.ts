import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  username: string = ''; // Armazena o nome do usuário
  avatarUrl: string = ''; // Armazena a URL do avatar
  userId: string = ''; // ID do usuário para operações de perfil
  showMenu: boolean = true; // Controla a visibilidade do menu

  constructor(
    private navCtrl: NavController,
    private apiService: ApiService,
    private router: Router
  ) {
    // Verifica se a rota atual corresponde a uma das rotas onde o menu deve ser ocultado
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hiddenMenuRoutes = ['/home', '/login', '/register']; // Rotas onde o menu não deve aparecer
        this.showMenu = !hiddenMenuRoutes.some(route => event.urlAfterRedirects.startsWith(route));
      }
    });
  }

  ngOnInit() {
    this.loadUserProfile(); // Carrega o perfil do usuário ao iniciar o componente
  }

  private loadUserProfile() {
    this.userId = localStorage.getItem('userId') || ''; // Recupera o ID do usuário do localStorage
    if (this.userId) {
      this.apiService.getUserProfile(this.userId).subscribe((user) => {
        this.username = user.nome;
        this.loadUserAvatar();
      });
    }
  }

  private loadUserAvatar() {
    if (this.userId) {
      this.apiService.getUserAvatar(this.userId).subscribe((avatarUrl) => {
        this.avatarUrl = avatarUrl;
      });
    }
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('/home'); // Redireciona para a página inicial após logout
  }
}
