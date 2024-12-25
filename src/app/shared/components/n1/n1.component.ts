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

  constructor(
    private resultadon1Service: Resultadon1Service
  ) {}

  ngOnInit(): void {}

  calcularN1() {
    this.resultadoN1 = (this.formalN1 * 8 + this.processualN1 * 2) / 10;
    this.resultadon1Service.setResultadoN1(this.resultadoN1);
  }
}
