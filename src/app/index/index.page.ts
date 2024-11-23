import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, NavController, LoadingController, ToastController } from '@ionic/angular';
import Swiper from 'swiper';
import type { SwiperOptions } from 'swiper/types';
import { ModalComponentComponent } from '../modal-component/modal-component.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit, AfterViewInit {
  swiper: Swiper | null = null;
  username: string = '';
  avatarUrl: string = '';
  userId: string = '';
  comentarios: any[] = [];
  clickListenersAdded: Set<Element> = new Set(); // Rastreamento de elementos que já possuem listeners

  recommendedLocations = [
    { name: 'Arcos da Lapa', image: '/assets/images/paisagem.png', stars: this.getStarRatings(3.5) },
    { name: 'Cristo Redentor', image: '/assets/images/paisagem.png', stars: this.getStarRatings(4) },
  ];
  recommendedPlaces = [
    { name: 'Grumari', image: '/assets/images/praia.png', stars: this.getStarRatings(5) },
    { name: 'Barra da Tijuca', image: '/assets/images/praia.png', stars: this.getStarRatings(3) },
    { name: 'Parque lage', image: '/assets/images/paisagem.png', stars: this.getStarRatings(3.5) }
  ];

  constructor(
    private modalController: ModalController,
    private navCtrl: NavController,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  ngAfterViewInit() {
    this.initializeSwiper();
  }

  private async loadUserProfile() {
    this.userId = localStorage.getItem('userId') || '';
    if (this.userId) {
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
    setTimeout(() => {
      const slides = document.querySelectorAll('.swiper-slide');
      slides.forEach(slide => {
        if (!this.clickListenersAdded.has(slide)) {
          slide.addEventListener('click', this.handleSlideClick.bind(this));
          this.clickListenersAdded.add(slide); // Marca o slide como tendo um listener adicionado
        }
      });
    }, 500);
  }

  private handleSlideClick(event: Event) {
    const slide = event.currentTarget as HTMLElement;
    const location = slide.querySelector('label')?.innerText || 'Local não definido';
    this.openModal(location);
  }

  async openModal(location: string) {
    const modal = await this.modalController.create({
      component: ModalComponentComponent,
      componentProps: {
        location: location,
        comentarios: this.comentarios,
      },
    });
    return await modal.present();
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
              this.loadUserAvatar();
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
