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

  recommendedLocations = [
    {
      name: 'Cristo Redentor',
      image: '/assets/images/cristo.jpg', // Substitua pela URL real
      stars: this.getStarRatings(5),
      latitude: -22.9519,
      longitude: -43.2105,
    },
    {
      name: 'Pão de Açúcar',
      image: '/assets/images/pao.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.8),
      latitude: -22.9486,
      longitude: -43.1563,
    },
    {
      name: 'Praia de Copacabana',
      image: '/assets/images/copacabana.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.7),
    },
    {
      name: 'Maracanã',
      image: '/assets/images/maraca.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.6),
    },
    {
      name: 'Jardim Botânico',
      image: '/assets/images/jardim.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.9),
    },
  ];

  recommendedPlaces = [
    {
      name: 'Praia da Joatinga',
      image: '/assets/images/joatinga.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.5),
    },
    {
      name: 'Pedra do Telégrafo',
      image: '/assets/images/pedra.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.7),
    },
    {
      name: 'Parque Natural da Prainha',
      image: '/assets/images/prainha.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.8),
    },
    {
      name: 'Mirante Dona Marta',
      image: '/assets/images/mirante.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.6),
    },
    {
      name: 'Ilha Fiscal',
      image: '/assets/images/fiscal.jpg', // Substitua pela URL real
      stars: this.getStarRatings(4.4),
    },
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
  }

  async openModal(data: any) {
    const modal = await this.modalController.create({
      component: ModalComponentComponent,
      componentProps: {
        location: data,
      },
    });
    return await modal.present();
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
