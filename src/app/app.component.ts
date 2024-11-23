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
  username: string = ''; // Nome do usuário
  avatarUrl: string = ''; // URL do avatar
  userId: string = ''; // ID do usuário
  showMenu: boolean = true; // Controla a visibilidade do menu

  constructor(
    private navCtrl: NavController,
    private apiService: ApiService,
    private router: Router
  ) {
    // Detecta mudanças na rota e oculta/exibe o menu
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const hiddenMenuRoutes = ['/home', '/login', '/register'];
        this.showMenu = !hiddenMenuRoutes.some(route => event.urlAfterRedirects.startsWith(route));
      }
    });
  }

  ngOnInit() {
    this.checkLoginStatus(); // Verifica se o usuário está logado
  }

  private checkLoginStatus() {
    this.userId = localStorage.getItem('userId') || ''; // Recupera o ID do usuário
    if (this.userId) {
      this.loadUserProfile(); // Carrega perfil e avatar
    } else {
      this.resetUser(); // Reseta o usuário para estado inicial
    }
  }

  private loadUserProfile() {
    this.apiService.getUserProfile(this.userId).subscribe(
      (user) => {
        this.username = user.nome; // Atualiza o nome do usuário
        this.loadUserAvatar(); // Atualiza o avatar
      },
      (error) => {
        console.error('Erro ao carregar perfil do usuário:', error);
        this.resetUser(); // Reseta o usuário caso ocorra erro
      }
    );
  }

  private loadUserAvatar() {
    this.apiService.getUserAvatar(this.userId).subscribe(
      (avatarUrl) => {
        this.avatarUrl = avatarUrl
          ? `${avatarUrl}?t=${new Date().getTime()}` // Força o navegador a buscar uma nova versão
          : '/assets/images/avatar.png'; // Avatar padrão
      },
      (error) => {
        console.error('Erro ao carregar avatar:', error);
        this.avatarUrl = '/assets/images/avatar.png'; // Fallback para avatar padrão
      }
    );
  }

  private resetUser() {
    this.username = ''; // Limpa o nome do usuário
    this.avatarUrl = '/assets/images/avatar.png'; // Reseta o avatar para padrão
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.resetUser(); // Reseta o estado do usuário
    this.navCtrl.navigateRoot('/home'); // Redireciona para a página inicial
  }  
}
