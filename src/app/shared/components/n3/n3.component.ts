import { Component, OnInit } from '@angular/core';
import { AvaliacaoserviceService } from '../../../services/avaliacaoservice.service';

@Component({
  selector: 'app-n3',
  templateUrl: './n3.component.html',
  styleUrls: ['./n3.component.scss'],
})
export class N3Component implements OnInit {
  public formalN3: number = 0;

  constructor(private avaliacaoService: AvaliacaoserviceService) {}

  ngOnInit(): void {}

  public calcularN3() {
    if (isNaN(this.formalN3)) {
      alert('Por favor, insira um valor válido para N3.');
      return;
    }

    this.avaliacaoService.setNota('N3', this.formalN3);
  }
}
