import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss'],
})
export class ModalComponentComponent implements OnInit {
  comment: string = ''; 
  rating: number | null = null; 
  apiUrl: string = 'https://crudtourmate-2717319c3c8e.herokuapp.com/comentarios'; // URL da API
  comentarios: any[] = []; // Array para armazenar os comentários

  constructor(
    private modalController: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getComentarios(); // Chama a função para obter os comentários ao iniciar o modal
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  selectRating(num: number) {
    this.rating = num;
  }

  // Função para obter os comentários da API
  getComentarios() {
    this.http.get(this.apiUrl).subscribe(
      (response: any) => {
        this.comentarios = response.comentarios; // Armazena os comentários recebidos
      },
      (error) => {
        console.error('Erro ao buscar comentários', error);
      }
    );
  }

  submitEvaluation() {
    const nome = localStorage.getItem('username'); // Obtém o nome do usuário logado do localStorage

    if (this.comment && this.rating !== null && nome) {
      const comentarioData = {
        nome: nome,
        comentario: this.comment,
        avaliacao: this.rating
      };

      this.http.post(this.apiUrl, comentarioData)
        .pipe(
          catchError(error => {
            console.error('Erro ao enviar comentário:', error);
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            console.log('Comentário enviado com sucesso:', response);
            this.getComentarios(); // Atualiza os comentários após enviar um novo
            this.comment = '';  // Limpa o campo de comentário
            this.rating = null;  // Reseta a avaliação

            // O modal não fechará automaticamente após o envio
          }
        });
    } else {
      console.error('Preencha o comentário, a avaliação e esteja logado.');
    }
  }
}
