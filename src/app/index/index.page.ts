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
    { name: 'Cristo Redentor', image: '/assets/images/cristo.jpg', stars: this.getStarRatings(5), latitude: -22.9519, longitude: -43.2105 },
    { name: 'Pão de Açúcar', image: '/assets/images/pao.jpg', stars: this.getStarRatings(4.8), latitude: -22.9486, longitude: -43.1563 },
    { name: 'Praia de Copacabana', image: '/assets/images/copacabana.jpg', stars: this.getStarRatings(4.7), latitude: -22.9714, longitude: -43.1822 },
    { name: 'Maracanã', image: '/assets/images/maraca.jpg', stars: this.getStarRatings(4.6), latitude: -22.9110, longitude: -43.2303 },
    { name: 'Jardim Botânico', image: '/assets/images/jardim.jpg', stars: this.getStarRatings(4.9), latitude: -22.9600, longitude: -43.2119 },
  ];
  
  recommendedPlaces = [
    { name: 'Praia da Joatinga', image: '/assets/images/joatinga.jpg', stars: this.getStarRatings(4.5), latitude: -23.0276, longitude: -43.3889 },
    { name: 'Pedra do Telégrafo', image: '/assets/images/pedra.jpg', stars: this.getStarRatings(4.7), latitude: -22.9987, longitude: -43.6150 },
    { name: 'Parque Natural da Prainha', image: '/assets/images/prainha.jpg', stars: this.getStarRatings(4.8), latitude: -23.0242, longitude: -43.5161 },
    { name: 'Mirante Dona Marta', image: '/assets/images/mirante.jpg', stars: this.getStarRatings(4.6), latitude: -22.9372, longitude: -43.1990 },
    { name: 'Ilha Fiscal', image: '/assets/images/fiscal.jpg', stars: this.getStarRatings(4.4), latitude: -22.9107, longitude: -43.1774 },
  ];
  
  sharedLocations: any[] = []; // Armazena locais compartilhados dinamicamente

  constructor(
    private modalController: ModalController,
    private navCtrl: NavController,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUserProfile(); // Carrega informações do usuário logado
    this.loadSharedLocations(); // Carrega locais compartilhados
  }

  ngAfterViewInit() {
    this.initializeSwiper(); // Inicializa o carrossel (Swiper.js)
  }

  private async loadUserProfile() {
    this.userId = localStorage.getItem('userId') || '';
    if (this.userId) {
      this.apiService.getUserProfile(this.userId).subscribe(user => {
        this.username = user.nome;
        this.loadUserAvatar(); // Carrega o avatar do usuário
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

  private loadSharedLocations() {
    const sharedLocations = JSON.parse(localStorage.getItem('sharedLocations') || '[]');
    this.sharedLocations = sharedLocations.map((loc: any) => ({
      ...loc,
      stars: this.getStarRatings(loc.rating),
    }));
  }

  /**
   * Atualiza a lista de locais compartilhados dinamicamente quando um novo local é adicionado.
   */
  private updateSharedLocations() {
    const sharedLocations = JSON.parse(localStorage.getItem('sharedLocations') || '[]');
    this.sharedLocations = sharedLocations.map((loc: any) => ({
      ...loc,
      stars: this.getStarRatings(loc.rating),
    }));
  }

  /**
   * Atualiza a página após adicionar um novo local.
   */
  refreshLocations() {
    this.updateSharedLocations(); // Atualiza a lista de locais compartilhados
    this.showToast('Novo local adicionado com sucesso!'); // Mensagem de confirmação
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.navCtrl.navigateRoot('/home'); // Redireciona para a página inicial
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
      componentProps: { location: data },
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

  /**
   * Exibe uma mensagem de sucesso ao usuário.
   */
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
