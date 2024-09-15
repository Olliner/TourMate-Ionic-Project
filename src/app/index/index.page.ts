import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  swiper: Swiper | null = null;

  constructor() {}

  ngOnInit() {
    // Inicialize o Swiper
    this.swiper = new Swiper('.swiper-container', {
      direction: 'horizontal', // Deslize horizontalmente
      loop: true,              // Habilita loop nos slides
      pagination: {
        el: '.swiper-pagination', // Contêiner de paginação
        clickable: true,
      },
      slidesPerView: 1,        // Quantos slides são mostrados ao mesmo tempo
      spaceBetween: 10,        // Espaço entre os slides
    });
  }
}
