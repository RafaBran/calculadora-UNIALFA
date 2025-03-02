import { Component, OnInit } from '@angular/core';
import { AvaliacaoserviceService } from '../../../services/avaliacaoservice.service';

@Component({
  selector: 'app-n4',
  templateUrl: './n4.component.html',
  styleUrls: ['./n4.component.scss'],
})
export class N4Component implements OnInit {
  public formalN4: number = 0;

  constructor(private avaliacaoService: AvaliacaoserviceService) {}

  ngOnInit(): void {}

  public calcularN4() {
    if (isNaN(this.formalN4)) {
      alert('Por favor, insira um valor válido para N4.');
      return;
    }

    this.avaliacaoService.setNota('N4', this.formalN4);
  }
}
