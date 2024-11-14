import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader'; // Importe o Loader

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;
  map: google.maps.Map | undefined;

  constructor() {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    // Criação do carregador da API com sua chave
    const loader = new Loader({
      apiKey: 'AIzaSyBvuqpS3outT1rMHLKy378FcuugHz12DkI',  // Sua chave de API
      version: 'weekly',
    });

    loader.load().then(() => {
      // Após o carregamento da API, inicializamos o mapa
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -23.55052, lng: -46.633308 },
        zoom: 12,
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    });
  }
}

