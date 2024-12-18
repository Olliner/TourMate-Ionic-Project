import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Loader } from '@googlemaps/js-api-loader';
import { ModalComponentComponent } from '../modal-component/modal-component.component';

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
  feedbackMessage: string = '';
  sharedLocations: any[] = []; // Adicionado

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const lat = parseFloat(params['lat']);
      const lng = parseFloat(params['lng']);
      const locationName = params['name'];

      if (!isNaN(lat) && !isNaN(lng)) {
        this.initMap(lat, lng, locationName);
      } else {
        this.initMap();
      }

      if (params['showCard'] === 'true') {
        this.isCardVisible = true;
      }
    });
    this.updateSharedLocations();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  initMap(lat?: number, lng?: number, locationName?: string) {
    const loader = new Loader({
      apiKey: 'YOUR_API_KEY',
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      const center = lat && lng ? { lat, lng } : { lat: -23.55052, lng: -46.633308 };

      const mapOptions: google.maps.MapOptions = {
        center: center,
        zoom: lat && lng ? 15 : 12,
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

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

  async capturePhoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
      });

      if (photo.dataUrl) {
        this.imageSrc = photo.dataUrl;
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
      this.showToast('Por favor, preencha todas as informações antes de salvar.');
      return;
    }

    const data = {
      name: this.locationName,
      rating: this.rating,
      image: this.imageSrc,
    };

    const savedLocations = JSON.parse(localStorage.getItem('sharedLocations') || '[]');
    savedLocations.push(data);
    localStorage.setItem('sharedLocations', JSON.stringify(savedLocations));

    this.updateSharedLocations();
    this.showToast('Informações salvas com sucesso!');
    this.resetForm();
  }

  updateSharedLocations() {
    const sharedLocations = JSON.parse(localStorage.getItem('sharedLocations') || '[]');
    this.sharedLocations = sharedLocations;
  }

  resetForm() {
    this.locationName = '';
    this.rating = 0;
    this.imageSrc = null;
    this.feedbackMessage = '';
  }
}