import { Component, OnInit } from '@angular/core';
import { Resultadon1Service } from './../../../core/services/resultadon1.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  resultadoN1: number | null = null;
  quantoFaltaparaN2: number | null = null;

  constructor(private resultadon1Service: Resultadon1Service) {}

  ngOnInit() {
    this.resultadon1Service.resultadoN1$.subscribe((resultado) => {
      this.resultadoN1 = resultado;
    });
    this.resultadon1Service.quantoFaltaN2$.subscribe((quantoFalta) => {
      this.quantoFaltaparaN2 = quantoFalta;
    });
  }
}
