import { Component, OnInit } from '@angular/core';
import { AvaliacaoserviceService } from '../../../services/avaliacaoservice.service';

@Component({
  selector: 'app-n1',
  templateUrl: './n1.component.html',
  styleUrls: ['./n1.component.scss'],
})
export class N1Component implements OnInit {
  public processualN1: number = 0;
  public formalN1: number = 0;
  public resultadoN1: number = 0;

  constructor(private avaliacaoService: AvaliacaoserviceService) {}

  ngOnInit(): void {}

  public calcularN1() {
    if (isNaN(this.processualN1) || isNaN(this.formalN1)) {
      alert('Por favor, insira valores válidos para N1.');
      return;
    }

    this.resultadoN1 = this.formalN1 * 0.8 + this.processualN1 * 0.2;
    this.avaliacaoService.setNota('N1', this.resultadoN1);
  }
}
