import { Component, OnInit } from '@angular/core';
import { ModalController, NavController  } from '@ionic/angular';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss'],
})
export class ModalComponentComponent implements OnInit {
  location: any; // Dados recebidos do local
  comentarios: any[] = []; // Lista de comentários
  comment: string = ''; // Comentário do usuário
  rating: number | null = null; // Avaliação selecionada pelo usuário

  constructor(private modalController: ModalController, private apiService: ApiService,private navCtrl: NavController) {}

  ngOnInit() {
    if (this.location?.name) {
      this.getComentarios(this.location.name);
    }
  }

  async closeModal() {
    await this.modalController.dismiss(); // Fecha o modal sem enviar dados
  }

  async goToMap() {
    const latitude = this.location.latitude;
    const longitude = this.location.longitude;
  
    if (latitude && longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(googleMapsUrl, '_blank'); // Abre o Google Maps em uma nova aba
    } else {
      console.error('Coordenadas inválidas para abrir o mapa.');
    }
  }
  

  getComentarios(locationName: string) {
    this.apiService.getEvaluations(locationName).subscribe(
      (response: any) => {
        this.comentarios = response || [];
      },
      (error) => {
        console.error('Erro ao buscar comentários:', error);
      }
    );
  }

  selectRating(rating: number) {
    this.rating = rating; // Define a avaliação escolhida
  }

  submitEvaluation() {
    if (this.comment && this.rating !== null) {
      const evaluation = {
        location: this.location.name, // Nome do local
        comment: this.comment,
        rating: this.rating,
      };

      this.apiService.submitEvaluation(evaluation).subscribe(
        () => {
          this.comentarios.push(evaluation); // Atualiza os comentários na interface
          this.comment = ''; // Limpa o campo de comentário
          this.rating = null; // Reseta a avaliação
        },
        (error) => {
          console.error('Erro ao enviar avaliação:', error);
        }
      );
    }
  }
}
