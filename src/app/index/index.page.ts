import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular'; // Importa NavController
import Swiper from 'swiper';

// Modal component
import { ModalComponentComponent } from '../modal-component/modal-component.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  swiper: Swiper | null = null;
  username: string = '';

  constructor(private modalController: ModalController, private navCtrl: NavController) {} // Injetar NavController

  ngOnInit() {
    // Recupera o nome do usuário do localStorage
    this.username = localStorage.getItem('username') || 'Usuário';

    // Inicializa o Swiper
    this.swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      slidesPerView: 1,
      spaceBetween: 10,
    });

    this.addSlideClickListeners();
  }

  // Método de logout
  logout() {
    // Limpa o nome do usuário do localStorage
    localStorage.removeItem('username');

    // Redireciona para a página de login
    this.navCtrl.navigateRoot('/home');
  }

  // Adiciona o listener para clique nos slides
  private async addSlideClickListeners() {
    const slides = document.querySelectorAll('.swiper-slide');

    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const location = (slide.querySelector('label') as HTMLElement)?.innerText || 'Local não definido';
        this.openModal(location); // Passando a string "location" diretamente
      });
    });
  }

  // Método para abrir o modal
  public async openModal(location: string) { // Aceita uma string
    const modal = await this.modalController.create({
      component: ModalComponentComponent, // Componente correto
      componentProps: { location }, // Passando o local como propriedade para o modal
    });

    await modal.present();
  }
}
