import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;
  map: google.maps.Map | undefined;

  searchQuery: string = ''; // Para a barra de pesquisa
  isCardVisible: boolean = false; // Para controlar a visibilidade do card
  locationName: string = ''; // Para armazenar o nome do local
  stars: number[] = [1, 2, 3, 4, 5]; // Array de estrelas
  rating: number = 0; // Avaliação do local
  imageSrc: string | null = null; // Para armazenar a imagem importada
  savedData: any[] = []; // Array para armazenar os dados salvos
  feedbackMessage: string = ''; // Mensagem de feedback para o usuário

  constructor() {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    const loader = new Loader({
      apiKey: 'AIzaSyBvuqpS3outT1rMHLKy378FcuugHz12DkI', // Sua chave de API
      version: 'weekly',
      libraries: ['places'], // Inclui a biblioteca 'places' necessária para a pesquisa
    });

    loader.load().then(() => {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: -23.55052, lng: -46.633308 }, // Coordenadas iniciais
        zoom: 12,
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    });
  }

  // Mostra/oculta o card
  toggleCard() {
    this.isCardVisible = !this.isCardVisible;
    this.feedbackMessage = ''; // Limpa mensagens ao abrir o card
  }

  // Fecha o card
  closeCard() {
    this.isCardVisible = false;
    this.feedbackMessage = ''; // Limpa mensagens ao fechar o card
  }

  // Define a avaliação do local
  setRating(rating: number) {
    this.rating = rating;
  }

  // Lida com o upload de arquivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string; // Armazena a imagem em base64 para exibição
      };
      reader.readAsDataURL(file);
    }
  }

  // Salva as informações fornecidas
  saveData() {
    if (!this.locationName || this.rating === 0) {
      this.feedbackMessage = 'Por favor, preencha todas as informações antes de salvar.';
      return;
    }

    const data = {
      name: this.locationName,
      rating: this.rating,
      image: this.imageSrc,
    };

    this.savedData.push(data); // Salva os dados no array
    console.log('Dados salvos:', this.savedData);

    // Atualiza a mensagem de sucesso
    this.feedbackMessage = 'Informações salvas com sucesso!';

    // Limpa os campos (mantém o card aberto para que o usuário veja a mensagem)
    this.locationName = '';
    this.rating = 0;
    this.imageSrc = null;
  }
}
