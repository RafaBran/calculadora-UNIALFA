import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-n1',
  templateUrl: './n1.component.html',
  styleUrls: ['./n1.component.scss'],
})
export class N1Component implements OnInit {

  public processualN1: number | any;
  public formalN1: number | any;
  public resultadoN1: number | any;



  constructor() {}

  ngOnInit(): void {}

  calcularN1() {

  }

  calculoQuantoFalta() {

  }

  public verificaValores() {
    if (isNaN(this.processualN1) || isNaN(this.formalN1)) {
      alert('O resultado do cálculo é inválido. Por favor, revise as notas.');
      return;
    }
  }

}
