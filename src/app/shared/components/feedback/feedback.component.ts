import { Component, OnInit } from '@angular/core';
import { AvaliacaoserviceService } from '../../../services/avaliacaoservice.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  mensagem: string | null = null;

  constructor(private avaliacaoService: AvaliacaoserviceService) {
    this.avaliacaoService.feedback$.subscribe((msg) => {
      this.mensagem = msg || '';
    });
  }

  ngOnInit() {}
}
