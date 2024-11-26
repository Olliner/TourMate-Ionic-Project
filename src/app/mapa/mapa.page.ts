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
  savedData: any[] = [];
  feedbackMessage: string = '';

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

      if (lat && lng) {
        this.initMap(lat, lng, locationName);
      } else {
        this.initMap();
      }

      if (params['showCard'] === 'true') {
        this.isCardVisible = true;
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

  async openModal() {
    const modal = await this.modalController.create({
      component: ModalComponentComponent,
    });

    modal.onDidDismiss().then((result) => {
      const data = result.data;
      if (data) {
        this.initMap(data.lat, data.lng, data.name);
      }
    });

    return await modal.present();
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
      this.feedbackMessage = 'Por favor, preencha todas as informações antes de salvar.';
      return;
    }

    const data = {
      name: this.locationName,
      rating: this.rating,
      image: this.imageSrc,
    };

    this.savedData.push(data);
    this.feedbackMessage = 'Informações salvas com sucesso!';
    this.resetForm();
  }

  resetForm() {
    this.locationName = '';
    this.rating = 0;
    this.imageSrc = null;
  }
}
