import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  @ViewChild('mapElement', { static: true }) mapElement!: ElementRef;
  map: google.maps.Map | undefined;

  searchQuery: string = '';
  isCardVisible: boolean = false;
  locationName: string = '';
  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;
  imageSrc: string | null = null;
  savedData: any[] = [];
  feedbackMessage: string = '';

  constructor(private route: ActivatedRoute) {} // Adicionado ActivatedRoute para ler os parâmetros da rota

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const lat = parseFloat(params['lat']);
      const lng = parseFloat(params['lng']);
      const locationName = params['name'];
  
      // Inicializa o mapa com o local específico se os parâmetros existirem
      if (lat && lng) {
        this.initMap(lat, lng, locationName);
      } else {
        // Inicializa o mapa com a posição padrão
        this.initMap();
      }
  
      // Verifica se o parâmetro "showCard" foi passado
      if (params['showCard'] === 'true') {
        this.isCardVisible = true; // Mostra o card automaticamente
      }
    });
  }
  

  initMap(lat?: number, lng?: number, locationName?: string) {
    const loader = new Loader({
      apiKey: 'AIzaSyBvuqpS3outT1rMHLKy378FcuugHz12DkI',
      version: 'weekly',
      libraries: ['places'],
    });
  
    loader.load().then(() => {
      const center = lat && lng ? { lat, lng } : { lat: -23.55052, lng: -46.633308 }; // Posição padrão para São Paulo
  
      const mapOptions: google.maps.MapOptions = {
        center: center,
        zoom: lat && lng ? 15 : 12, // Aproxima mais se for localização específica
      };
  
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  
      // Adiciona marcador se coordenadas forem fornecidas
      if (lat && lng && locationName) {
        new google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          title: locationName,
        });
      }
    });
  }
  

  toggleCard() {
    this.isCardVisible = !this.isCardVisible;
    this.feedbackMessage = '';
  }

  closeCard() {
    this.isCardVisible = false;
    this.feedbackMessage = '';
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  // Captura foto usando a câmera
  async capturePhoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });

      // Verifica se o dataUrl é definido
      if (photo.dataUrl) {
        this.imageSrc = photo.dataUrl;
      } else {
        console.error('Foto capturada não contém dataUrl.');
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

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

    this.savedData.push(data);
    console.log('Dados salvos:', this.savedData);

    this.feedbackMessage = 'Informações salvas com sucesso!';

    this.locationName = '';
    this.rating = 0;
    this.imageSrc = null;
  }
}
