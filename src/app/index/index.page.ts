import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, LoadingController, ToastController } from '@ionic/angular';
import Swiper from 'swiper';
import type { SwiperOptions } from 'swiper/types';
import { ModalComponentComponent } from '../modal-component/modal-component.component';
import { ApiService } from '../services/api.service'; // Importando o ApiService para uso de upload de avatar e perfil

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  swiper: Swiper | null = null;
  username: string = '';
  avatarUrl: string = '';
  userId: string = ''; // ID do usuário para operações de perfil

  recommendedLocations = [
    { name: 'Arcos da Lapa', image: '/assets/images/paisagem.png', stars: this.getStarRatings(3.5) },
    // Adicione outros locais conforme necessário
  ];
  recommendedPlaces = [
    { name: 'Praia', image: '/assets/images/praia.png', stars: this.getStarRatings(5) },
    // Adicione outros lugares conforme necessário
  ];

  constructor(
    private modalController: ModalController,
    private navCtrl: NavController,
    private apiService: ApiService, // Injeta ApiService para operações de API
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.initializeSwiper();
  }

  private async loadUserProfile() {
    this.userId = localStorage.getItem('userId') || ''; // Recupera o ID do usuário do localStorage
    if (this.userId) {
      // Carrega o perfil do usuário
      this.apiService.getUserProfile(this.userId).subscribe(user => {
        this.username = user.nome;
        this.loadUserAvatar();
      });
    }
  }

  private loadUserAvatar() {
    if (this.userId) {
      this.apiService.getUserAvatar(this.userId).subscribe(avatarUrl => {
        this.avatarUrl = avatarUrl;
      });
    }
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('/home');
  }

  private initializeSwiper() {
    const swiperOptions: SwiperOptions = {
      direction: 'horizontal',
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      slidesPerView: 1,
      spaceBetween: 10,
    };

    this.swiper = new Swiper('.swiper-container', swiperOptions);
    this.addSlideClickListeners();
  }

  private addSlideClickListeners() {
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const location = (slide.querySelector('label') as HTMLElement)?.innerText || 'Local não definido';
        this.openModal(location);
      });
    });
  }

  async openModal(location: string) {
    const modal = await this.modalController.create({
      component: ModalComponentComponent,
      componentProps: { location },
    });
    await modal.present();
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
          (response: any) => { // Corrigindo o tipo para `any` ou o tipo correto da resposta
            loading.dismiss();

            if (response && response.avatar_url) {
              this.avatarUrl = `${response.avatar_url}?t=${new Date().getTime()}`;
              this.presentToast('Avatar atualizado com sucesso!');
              this.loadUserAvatar(); // Atualiza o avatar ao recarregar o perfil
            } else {
              console.error('URL do avatar retornada está vazia ou indefinida');
              this.presentToast('Erro ao atualizar avatar.');
            }
          },
          error => {
            loading.dismiss();
            console.error('Erro ao atualizar avatar:', error);
            this.presentToast('Erro ao atualizar avatar.');
          }
        );
      }
    };
    input.click();
  }

  private async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      duration: 2000,
    });
    await loading.present();
    return loading;
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    await toast.present();
  }

  private getStarRatings(rating: number) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = Array(fullStars).fill({ half: false });

    if (halfStar) stars.push({ half: true });
    while (stars.length < 5) stars.push({ half: true });

    return stars;
  }
}
