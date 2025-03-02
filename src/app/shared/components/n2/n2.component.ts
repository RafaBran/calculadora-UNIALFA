import { Component, OnInit } from '@angular/core';
import { AvaliacaoserviceService } from '../../../services/avaliacaoservice.service';

@Component({
  selector: 'app-n2',
  templateUrl: './n2.component.html',
  styleUrls: ['./n2.component.scss'],
})
export class N2Component implements OnInit {
  public processualN2: number = 0;
  public formalN2: number = 0;
  public resultadoN2: number = 0;

  constructor(private avaliacaoService: AvaliacaoserviceService) {}

  ngOnInit(): void {}

  public calcularN2() {
    if (isNaN(this.processualN2) || isNaN(this.formalN2)) {
      alert('Por favor, insira valores válidos para N2.');
      return;
    }

    this.resultadoN2 = this.formalN2 * 0.8 + this.processualN2 * 0.2;
    this.avaliacaoService.setNota('N2', this.resultadoN2);
  }
}
