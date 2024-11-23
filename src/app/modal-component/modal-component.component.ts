import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; // Importação do serviço de API

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss'],
})
export class ModalComponentComponent implements OnInit {
  comment: string = ''; // Comentário do usuário
  rating: number | null = null; // Avaliação selecionada
  location: string = ''; // Local selecionado, recebido ao abrir o modal
  comentarios: any[] = []; // Array para armazenar os comentários do local

  constructor(
    private modalController: ModalController,
    private apiService: ApiService // Injeção do serviço de API
  ) {}

  ngOnInit() {
    this.getComentarios(); // Busca os comentários ao iniciar o modal
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  selectRating(num: number) {
    this.rating = num; // Define a avaliação selecionada
  }

  // Função para buscar os comentários da API
  getComentarios() {
    this.apiService.getEvaluations(this.location).subscribe(
      (response: any) => {
        this.comentarios = response || []; // Armazena os comentários recebidos
      },
      (error) => {
        console.error('Erro ao buscar comentários:', error);
      }
    );
  }

  // Envia avaliação e comentário para a API
  submitEvaluation() {
    const nome = localStorage.getItem('username'); // Obtém o nome do usuário logado do localStorage

    if (this.comment && this.rating !== null && nome) {
      const evaluationData = {
        location: this.location,
        comment: this.comment,
        rating: this.rating,
      };

      this.apiService.submitEvaluation(evaluationData).subscribe(
        (response) => {
          console.log('Comentário enviado com sucesso:', response);
          this.getComentarios(); // Atualiza os comentários após envio
          this.comment = ''; // Reseta o campo de comentário
          this.rating = null; // Reseta a avaliação
        },
        (error) => {
          console.error('Erro ao enviar comentário:', error);
        }
      );
    } else {
      console.error('Preencha o comentário, a avaliação e esteja logado.');
    }
  }
}
