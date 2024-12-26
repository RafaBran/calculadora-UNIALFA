import { Resultadon1Service } from './../../../core/services/resultadon1.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-n1',
  templateUrl: './n1.component.html',
  styleUrls: ['./n1.component.scss'],
})
export class N1Component implements OnInit {
  processualN1: number | any;
  formalN1: number | any;
  resultadoN1: number | any;
  quantoFaltaparaN2: number | any;

  constructor(private resultadon1Service: Resultadon1Service) {}

  ngOnInit(): void {}

  calcularN1() {
    // if (isNaN(this.processualN1) || isNaN(this.formalN1)) {
    //   alert('O resultado do cálculo é inválido. Por favor, revise as notas.');
    //   return;
    // } else {
    //   this.resultadoN1 = (this.formalN1 * 8 + this.processualN1 * 2) / 10;
    //   this.resultadon1Service.setResultadoN1(this.resultadoN1);
    // }

    if (isNaN(this.processualN1) || isNaN(this.formalN1)) {
      alert('O resultado do cálculo é inválido. Por favor, revise as notas.');
      return;
    }
    this.resultadoN1 = (this.formalN1 * 8 + this.processualN1 * 2) / 10;
    this.resultadon1Service.setResultadoN1(this.resultadoN1);
    this.calculoQuantoFalta();
  }

  calculoQuantoFalta() {
    this.quantoFaltaparaN2 = 8 - this.resultadoN1;
    this.resultadon1Service.setQuantoFaltaN2(this.quantoFaltaparaN2);
  }
}
